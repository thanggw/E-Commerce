package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.WishlistItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItemEntity, Integer> {
}
