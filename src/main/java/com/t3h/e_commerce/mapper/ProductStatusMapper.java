package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.ProductStatusResponse;
import com.t3h.e_commerce.entity.ProductStatusEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductStatusMapper {
    ProductStatusMapper INSTANCE = Mappers.getMapper(ProductStatusMapper.class);

    default ProductStatusResponse toResponse(ProductStatusEntity productStatusEntity) {
        return ProductStatusResponse.builder()
                .code(productStatusEntity.getCode())
                .description(productStatusEntity.getDescription())
                .build();
    }
}


