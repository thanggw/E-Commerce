package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper2 {

    // Map ProductEntity to ProductResponse
    @Mapping(source = "name", target = "name")
    @Mapping(source = "image", target = "imageUrl")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "quantity", target = "quantity")
    ProductResponse toProductResponse(ProductEntity product);


}