package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColorRespository extends JpaRepository<Color, Integer> {
    Optional<Color> findByName(String name);
}
