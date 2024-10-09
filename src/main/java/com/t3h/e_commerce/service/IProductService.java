package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;

public interface IProductService {
    ProductResponse createProduct(ProductCreationRequest request);
}
