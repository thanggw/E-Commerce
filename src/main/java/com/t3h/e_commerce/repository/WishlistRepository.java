package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, Integer> {
    Optional<WishlistEntity> findByUserId(Integer userId);

}
