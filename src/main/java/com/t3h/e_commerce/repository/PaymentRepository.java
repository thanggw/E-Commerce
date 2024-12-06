package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.PaymentEntity;
import com.t3h.e_commerce.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
}


