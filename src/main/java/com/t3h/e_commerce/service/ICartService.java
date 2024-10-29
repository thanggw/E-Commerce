package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;

public interface ICartService {

    CartResponse addToCart(AddToCartRequest request);

    CartResponse updateCart(Integer itemId, CartItemUpdate request);

    CartResponse deleteCart(Integer itemId);
}
