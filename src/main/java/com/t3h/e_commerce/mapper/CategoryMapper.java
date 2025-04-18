package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.requests.CategoryCreationRequest;
import com.t3h.e_commerce.dto.responses.CategoryResponse;
import com.t3h.e_commerce.entity.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryEntity toEntity(CategoryCreationRequest categoryCreationRequest);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "description", target = "description")
    CategoryResponse toResponse(CategoryEntity categoryEntity);
}
