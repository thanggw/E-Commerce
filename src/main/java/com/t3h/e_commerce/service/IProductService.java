package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;


public interface IProductService {
    ProductResponse createProduct(ProductCreationRequest request);

    ResponsePage<ProductResponse> getAllProducts(ProductRequestFilter filter, int page, int size);

    ProductResponse updateProduct(Integer id, ProductUpdateRequest request);

    ProductResponse getById(Integer id);
}
