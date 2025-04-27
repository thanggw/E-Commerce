package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;

public interface ICartService {

    CartResponse addToCart(AddToCartRequest request);
    CartResponse getCartByCurrentUser();
    boolean removeItemFromCart(Integer productId);
}
