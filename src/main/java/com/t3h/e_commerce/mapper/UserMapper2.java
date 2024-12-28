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


      UserResponse toDTO(UserEntity userEntity);
      @Mapping(source = "id", target = "id")
      @Mapping(source = "username", target = "username")
      @Mapping(source = "email", target = "email")
      @Mapping(source = "firstName", target = "firstName")
      @Mapping(source = "lastName", target = "lastName")
      @Mapping(source = "phone", target = "phone")
      @Mapping(source = "address", target = "address")
      UserEntity toEntity(UserResponse userResponse);
}
