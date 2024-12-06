package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.responses.CartItemResponse;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.CartItemEntity;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.ProductImage;
import com.t3h.e_commerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    @Autowired
    private ProductRepository productRepository;

    public CartItemEntity toCartItemEntity(AddToCartRequest request, CartEntity cart) {
        ProductEntity product = productRepository.findById(request.getProductId().intValue())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItemEntity cartItem = new CartItemEntity();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setPrice(product.getPrice().multiply(new BigDecimal(request.getQuantity())));

        return cartItem;
    }

    public CartResponse toCartResponse(CartEntity cart) {
        return CartResponse.builder()
                .cartId(cart.getId())
                .totalQuantity(cart.getTotalQuantity())
                .totalPrice(cart.getTotalPrice()) // Sử dụng totalPrice từ CartEntity
                .items(cart.getCartItems().stream().map(this::toCartItemResponse).collect(Collectors.toList()))
                .createdDate(cart.getCreatedDate())
                .createdBy(cart.getCreatedBy())
                .lastModifiedDate(cart.getLastModifiedDate())
                .lastModifiedBy(cart.getLastModifiedBy())
                .deleted(cart.getDeleted())
                .build();
    }



    private CartItemResponse toCartItemResponse(CartItemEntity cartItem) {
        ProductEntity product = cartItem.getProduct();
        return CartItemResponse.builder()
                .itemId(cartItem.getId())
                .productId(product.getId())
                .productImage(product.getImages().iterator().next().getImageUrl()) // Lấy ảnh đầu tiên
                .productName(product.getName())
                .productQuantity(cartItem.getQuantity())
                .productPrice(cartItem.getPrice())
                .isAvailable(product.isAvailable())
                .color(cartItem.getColor().getName())  // Thêm color
                .size(cartItem.getSize().getName())    // Thêm size
                .build();
    }

}
