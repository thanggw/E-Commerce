package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Integer> {
    Optional<RoleEntity> findRoleEntityByCode(String roleName);
}
