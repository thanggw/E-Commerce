package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.BusinessHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.Optional;

@Repository
public interface BusinessHourRepository extends JpaRepository<BusinessHour, Long> {
    Optional<BusinessHour> findByDayOfWeek(DayOfWeek dayOfWeek);
}
