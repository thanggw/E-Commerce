package com.t3h.e_commerce.dto.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Integer id;
    String name;
    private List<String> imageUrls;;
    BigDecimal price;
    String description;
    BrandResponse brand;
    CategoryResponse category;
    boolean isSoldOut;
    boolean isAvailable;
    Integer quantity;
    ProductStatusResponse status;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime lastModifiedDate;
    String lastModifiedBy;
    boolean deleted;
    private Set<ColorResponse> colors;
    private Set<SizeResponse> sizes;
}
