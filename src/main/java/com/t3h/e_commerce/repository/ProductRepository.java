package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    List<ProductEntity> findByNameContainingIgnoreCase(String name);

    @Query(value = "SELECT p FROM ProductEntity p " +
            "LEFT JOIN p.brand b " +
            "LEFT JOIN p.category c " +
            "WHERE (:#{#filter.name} IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :#{#filter.name}, '%'))) " +
            "AND (:#{#filter.minPrice} IS NULL OR p.price >= COALESCE(:#{#filter.minPrice}, p.price)) " +
            "AND (:#{#filter.maxPrice} IS NULL OR p.price <= COALESCE(:#{#filter.maxPrice}, p.price)) " +
            "AND (:#{#filter.category} IS NULL OR c.code = :#{#filter.category}) " +
            "AND (:#{#filter.brand} IS NULL OR b.code = :#{#filter.brand})")

    Page<ProductEntity> searchProductEntitiesByConditions(@Param("filter") ProductRequestFilter filter, Pageable pageable);
    List<ProductEntity> findByUser_Id(Integer userId);
}
