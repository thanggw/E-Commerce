package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.entity.ProductEntity;


public class ProductMapper {
    public static ProductResponse toProductResponse(ProductEntity product){
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .imageUrl(product.getImage())
                .build();
    }

    public static ProductEntity toProductEntity(ProductCreationRequest request){
        ProductEntity product = new ProductEntity();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());
        product.setQuantity(request.getQuantity());
        return product;
    }

}
