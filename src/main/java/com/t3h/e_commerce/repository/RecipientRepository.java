package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.RecipientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipientRepository extends JpaRepository<RecipientEntity, Integer> {
}
