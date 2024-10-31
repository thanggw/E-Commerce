package com.t3h.e_commerce.mapper.decorator;

import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.mapper.RoleMapper;
import com.t3h.e_commerce.mapper.UserMapper;
import com.t3h.e_commerce.mapper.UserMapper2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class UserMapperDecorator implements UserMapper2 {

    @Autowired
    @Qualifier("delegate")
    private UserMapper2 delegate;

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public UserResponse toDTO(UserEntity userEntity) {
        UserResponse userResponse = delegate.toDTO(userEntity);
        userResponse.setRoles(roleMapper.toRoleDTOSet(userEntity.getRoles()));
        return userResponse;
    }

    @Override
    public UserEntity toEntity(UserResponse userResponse) {
        UserEntity userEntity = delegate.toEntity(userResponse);
        userEntity.setRoles(roleMapper.toRoleEntitySet(userResponse.getRoles()));
        return userEntity;
    }
}
