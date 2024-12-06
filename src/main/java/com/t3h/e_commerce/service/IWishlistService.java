package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.AddToWishlistRequest;
import com.t3h.e_commerce.dto.responses.WishlistResponse;

public interface IWishlistService {
    WishlistResponse addToWishlist(AddToWishlistRequest request);
    WishlistResponse getWishlistByUserId(Integer id);
}
