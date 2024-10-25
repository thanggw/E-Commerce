package com.t3h.e_commerce.dto.requests;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Getter
@Setter
public class ProductRequestFilter {
    private String name;
    private String category;
    private String brand;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private LocalDate fromDateQuery;
    private LocalDate toDateQuery;
}
