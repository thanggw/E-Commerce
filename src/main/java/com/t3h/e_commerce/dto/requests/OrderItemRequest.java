package com.t3h.e_commerce.dto.requests;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemRequest {
    private Integer itemId;
    private Integer productId;
    private String productImage;
    private String productName;
    private Integer productQuantity;
    private BigDecimal productPrice;
    private boolean isAvailable;
    private String color;
    private String size;
}
