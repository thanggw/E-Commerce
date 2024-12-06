package com.t3h.e_commerce.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String productName;
    private String imageUrl;
    private String color;
    private String size;
    private Integer quantity;
    private BigDecimal totalPrice;
    private BigDecimal shippingCost;
    private BigDecimal finalPrice;
    private String trackingId;
    private LocalDateTime expectedDeliveryDate;
}

