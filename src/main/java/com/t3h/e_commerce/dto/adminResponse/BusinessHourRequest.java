package com.t3h.e_commerce.dto.adminResponse;

import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
public class BusinessHourRequest {
    private DayOfWeek dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
}

