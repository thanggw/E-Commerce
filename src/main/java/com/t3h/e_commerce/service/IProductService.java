package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.entity.ProductEntity;

import java.util.List;


public interface IProductService {
    ProductEntity addProduct(ProductRequest request);

    ResponsePage<ProductResponse> getAllProducts(ProductRequestFilter filter, int page, int size);
    List<ProductResponse> searchProductsByName(String name);


    ProductResponse updateProduct(Integer id, ProductUpdateRequest request);

    ProductResponse getProductById(Integer id);
}
