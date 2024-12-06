package com.t3h.e_commerce.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String name;
    private BigDecimal price;
    private String description;
    private Integer quantity;
    private Set<String> colors; // Danh sách màu (tên màu)
    private Set<String> sizes;  // Danh sách size (tên size)
    private String brandCode;   // Mã brand
    private String categoryCode; // Mã category
    private List<String> imageUrls; // Danh sách URL ảnh
    private String statusCode;   // Mã trạng thái
}
