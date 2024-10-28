package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.CartItemEntity;
import com.t3h.e_commerce.entity.OrderEntity;
import com.t3h.e_commerce.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    List<OrderEntity> findByUser(UserEntity user);
}
