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
import org.springframework.stereotype.Service;
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
    public CartResponse addToCart(AddToCartRequest request) {
        // Lấy thông tin người dùng
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Lấy giỏ hàng
        CartEntity cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            CartEntity newCart = new CartEntity();
            newCart.setUser(user);
            newCart.setTotalQuantity(0);
            newCart.setTotalPrice(BigDecimal.ZERO);
            return newCart;
        });

        // Lấy thông tin sản phẩm
        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Lấy thông tin color và size
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
    public CartResponse getCartByUserId(Integer userId) {
        // Lấy giỏ hàng của người dùng
        CartEntity cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));

        // Lọc các sản phẩm chưa bị xóa (deleted = false)
        List<CartItemEntity> activeItems = cart.getCartItems().stream()
                .filter(item -> !item.getDeleted())  // Chỉ lấy các sản phẩm chưa bị xóa
                .collect(Collectors.toList());

        // Cập nhật lại giỏ hàng với danh sách các sản phẩm chưa bị xóa
        cart.setCartItems(activeItems);

        // Trả về CartResponse, đảm bảo danh sách sản phẩm đã được lọc
        return cartMapper.toCartResponse(cart);
    }


    @Override
    public boolean removeItemFromCart(Integer userId, Integer productId) {
        // Tìm giỏ hàng của người dùng
        CartEntity cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            return false;
        }

        // Tìm sản phẩm trong giỏ hàng
        CartItemEntity cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst().orElse(null);

        if (cartItem != null) {
            // Đánh dấu sản phẩm là đã xóa (thay vì xóa hoàn toàn)
            cartItem.setDeleted(true);  // Đánh dấu sản phẩm là xóa
            cartItemRepository.save(cartItem);  // Lưu lại thay đổi
            return true;
        }
        return false;
    }

}
