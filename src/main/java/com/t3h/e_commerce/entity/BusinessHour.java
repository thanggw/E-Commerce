package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "business_hours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek; // Thứ trong tuần (MONDAY, TUESDAY, ...)

    private LocalTime openTime;
    private LocalTime closeTime;
}

