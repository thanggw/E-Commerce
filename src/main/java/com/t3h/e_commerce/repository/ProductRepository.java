package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    @Query(value = "select p from ProductEntity p left join p.brand b left join p.category c" +
        " WHERE (:#{#filter.name} is null OR LOWER(p.name) LIKE LOWER(CONCAT('%', :#{#filter.name}, '%')))" +
        " AND (:#{#filter.minPrice} is null OR p.price >= :#{#filter.minPrice})" +
        " AND (:#{#filter.maxPrice} is null OR p.price <= :#{#filter.maxPrice})" +
        " AND (:#{#filter.category} is null OR c.code = :#{#filter.category})" +
        " AND (:#{#filter.brand} is null OR b.code = :#{#filter.brand})")
    Page<ProductEntity> searchProductEntitiesByConditions(@Param("filter") ProductRequestFilter filter, Pageable pageable);
}
