package com.t3h.e_commerce.dto.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Integer id;
    String name;
    String imageUrl;
    BigDecimal price;
    String description;
    BrandResponse brand;
    CategoryResponse category;
    boolean isSoldOut;
    boolean isAvailable;
    Integer quantity;
    String productStatus;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime lastModifiedDate;
    String lastModifiedBy;
    boolean deleted;

}
