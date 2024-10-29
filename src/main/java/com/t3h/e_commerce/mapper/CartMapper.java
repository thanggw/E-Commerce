package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.CartItemResponse;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.CartItemEntity;

import java.util.List;

public class CartMapper {


    public static CartResponse toCartResponse(CartEntity cart){

        List<CartItemResponse> cartItemResponses = cart.getCartItems().stream()
                .map(CartMapper::toCartItemResponse)
                .toList();

        return CartResponse.builder()
                .id(cart.getId())
                .items(cartItemResponses)
                .createdBy(cart.getCreatedBy())
                .createdDate(cart.getCreatedDate())
                .totalQuantity(cart.getTotalQuantity())
                .deleted(cart.getDeleted())
                .lastModifiedBy(cart.getLastModifiedBy())
                .lastModifiedDate(cart.getLastModifiedDate())
                .build();
    }


    public static CartItemResponse toCartItemResponse(CartItemEntity cartItem){

        if(cartItem.getProduct().isAvailable()){
            return CartItemResponse.builder()
                    .itemId(cartItem.getId())
                    .productId(cartItem.getProduct().getId())
                    .productImage(cartItem.getProduct().getImage())
                    .productName(cartItem.getProduct().getName())
                    .productQuantity(cartItem.getProduct().getQuantity())
                    .isAvailable(cartItem.getProduct().isAvailable())
                    .build();
        }
        else {
            return CartItemResponse.builder()
                    .itemId(cartItem.getId())
                    .productId(cartItem.getProduct().getId())
                    .productImage(cartItem.getProduct().getImage())
                    .productName(cartItem.getProduct().getName())
                    .productQuantity(0)
                    .isAvailable(cartItem.getProduct().isAvailable())
                    .build();
        }


    }
}
