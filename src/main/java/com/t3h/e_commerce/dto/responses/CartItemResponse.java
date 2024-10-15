package com.t3h.e_commerce.dto.responses;

import lombok.AccessLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    Integer itemId;
    Integer productId;
    String productImage;
    String productName;
    Integer productQuantity;
    BigDecimal productPrice;
    boolean isAvailable;
}
