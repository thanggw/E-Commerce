package com.t3h.e_commerce.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    String name;
    String image;
    String description;
    BigDecimal price;
    Integer quantity;
    Integer brandId;
    Integer categoryId;
    Integer productStatusCodeId;
}
