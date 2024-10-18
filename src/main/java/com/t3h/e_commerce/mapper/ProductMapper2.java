package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper2 {

    // Map ProductEntity to ProductResponse

    ProductResponse toProductResponse(ProductEntity product);


}