package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.requests.BrandCreationRequest;
import com.t3h.e_commerce.dto.responses.BrandResponse;
import com.t3h.e_commerce.entity.BrandEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BrandMapper {
    BrandMapper INSTANCE = Mappers.getMapper(BrandMapper.class);
    BrandEntity toEntity(BrandCreationRequest brandCreationRequest);


    BrandResponse toResponse(BrandEntity brandEntity);
}
