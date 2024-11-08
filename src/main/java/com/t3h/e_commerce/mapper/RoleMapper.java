package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.RoleDTO;
import com.t3h.e_commerce.entity.RoleEntity;
import org.mapstruct.Mapper;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO toRoleDTO(RoleEntity roleEntity);
    RoleEntity toRoleEntity(RoleDTO roleDTO);

    default Set<RoleDTO> toRoleDTOSet(Set<RoleEntity> roleEntities) {
        return roleEntities.stream().map(this::toRoleDTO).collect(Collectors.toSet());
    }
    default Set<RoleEntity> toRoleEntitySet(Set<RoleDTO> roleDTOS) {
        return roleDTOS.stream().map(this::toRoleEntity).collect(Collectors.toSet());
    }
}
