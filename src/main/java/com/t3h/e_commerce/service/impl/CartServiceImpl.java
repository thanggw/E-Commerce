package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.CartItemEntity;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.mapper.CartMapper;
import com.t3h.e_commerce.repository.CartItemRepository;
import com.t3h.e_commerce.repository.CartRepository;
import com.t3h.e_commerce.repository.ProductRepository;
import com.t3h.e_commerce.service.ICartService;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final IUserService iUserService;


    @Override
    public CartResponse addToCart(AddToCartRequest request) {
        return null;
    }

    @Override
    public CartResponse updateCart(Integer itemId, CartItemUpdate request) {
        return null;
    }

    @Override
    public CartResponse deleteCart(Integer itemId) {
        return null;
    }

    private BigDecimal multiplyQuantityPurchasedAndPrice(BigDecimal price, int quantityPurchased){
        return price.multiply(BigDecimal.valueOf(quantityPurchased));
    }


}
