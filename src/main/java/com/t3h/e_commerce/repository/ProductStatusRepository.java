package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.ProductStatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ProductStatusRepository extends JpaRepository<ProductStatusEntity, Integer> {
    Optional<ProductStatusEntity> findByCode(String code);

}
