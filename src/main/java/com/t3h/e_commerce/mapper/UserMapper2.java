package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.UserEntity;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface UserMapper2 {
      UserResponse toDTO(UserEntity userEntity);
      UserEntity toEntity(UserResponse userResponse);
}
