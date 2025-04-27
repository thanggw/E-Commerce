package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.mapper.CartMapper;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.ICartService;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ColorRespository colorRepository;

    @Autowired
    private SizeRepository sizeRepository;

    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        // 1. Lấy user từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Lấy giỏ hàng (phần còn lại giữ nguyên)
        CartEntity cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            CartEntity newCart = new CartEntity();
            newCart.setUser(user);
            newCart.setTotalQuantity(0);
            newCart.setTotalPrice(BigDecimal.ZERO);
            return cartRepository.save(newCart);
        });

        // 3. Logic thêm sản phẩm (giữ nguyên)
        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new IllegalArgumentException("Color not found"));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new IllegalArgumentException("Size not found"));

        // Kiểm tra xem sản phẩm với color & size đã tồn tại trong giỏ hàng chưa
        Optional<CartItemEntity> existingCartItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId())
                        && item.getColor().getId().equals(color.getId())
                        && item.getSize().getId().equals(size.getId()))
                .findFirst();

        if (existingCartItemOpt.isPresent()) {
            CartItemEntity existingCartItem = existingCartItemOpt.get();
            existingCartItem.setQuantity(existingCartItem.getQuantity() + request.getQuantity());
        } else {
            CartItemEntity newCartItem = new CartItemEntity();
            newCartItem.setCart(cart);
            newCartItem.setProduct(product);
            newCartItem.setColor(color);
            newCartItem.setSize(size);
            newCartItem.setQuantity(request.getQuantity());
            newCartItem.setPrice(product.getPrice());
            cart.getCartItems().add(newCartItem);
        }

        // Cập nhật giỏ hàng
        cart.setTotalQuantity(cart.getCartItems().stream().mapToInt(CartItemEntity::getQuantity).sum());
        cart.setTotalPrice(cart.getCartItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }






    @Override
    public CartResponse getCartByCurrentUser() {
        // Lấy username (email) từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm user bằng username (email)
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Lấy giỏ hàng của user
        CartEntity cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));

        // Lọc các sản phẩm chưa bị xóa
        List<CartItemEntity> activeItems = cart.getCartItems().stream()
                .filter(item -> !item.getDeleted())
                .collect(Collectors.toList());

        cart.setCartItems(activeItems);
        return cartMapper.toCartResponse(cart);
    }


    @Override
    @Transactional
    public boolean removeItemFromCart(Integer productId) {
        // 1. Lấy thông tin user từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Lấy giỏ hàng (giữ nguyên logic cũ)
        CartEntity cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart == null) {
            return false;
        }

        // 3. Tìm và đánh dấu xóa sản phẩm (giữ nguyên logic soft delete)
        CartItemEntity cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId) && !item.getDeleted())
                .findFirst().orElse(null);

        if (cartItem != null) {
            cartItem.setDeleted(true);
            cartItemRepository.save(cartItem);

            // (Optional) Cập nhật tổng quantity/price
            updateCartTotals(cart);
            return true;
        }
        return false;
    }

    private void updateCartTotals(CartEntity cart) {
        int totalQuantity = cart.getCartItems().stream()
                .filter(item -> !item.getDeleted())
                .mapToInt(CartItemEntity::getQuantity)
                .sum();

        BigDecimal totalPrice = cart.getCartItems().stream()
                .filter(item -> !item.getDeleted())
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalQuantity(totalQuantity);
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);
    }

}
