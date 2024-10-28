package com.t3h.e_commerce.dto.responses;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    private Long itemId;
    private String productName;
    private int quantity;
    private double pricePerUnit;
    private String size;
    private String color;
}
