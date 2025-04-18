package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    List<ReviewEntity> findByProductId(Integer productId);
}
