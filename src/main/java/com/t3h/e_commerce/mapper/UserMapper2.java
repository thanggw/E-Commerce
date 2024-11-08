package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.mapper.decorator.UserMapperDecorator;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
@DecoratedWith(UserMapperDecorator.class)
public interface UserMapper2 {
      @Mapping(source = "address", target = "address")
      UserResponse toDTO(UserEntity userEntity);
      UserEntity toEntity(UserResponse userResponse);
}
