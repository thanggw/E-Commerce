package com.t3h.e_commerce.dto.responses;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)


public class OrderResponse {
    private Long orderId;
    private int totalQuantity;
    private BigDecimal totalPrice;
    private BigDecimal shippingCost;
    private double discount;
    private double finalPrice;
    private String orderStatus;
    private String orderPlacedBy;
    private LocalDateTime createdDate;
    private LocalDateTime expectedDeliveryDate;
    private String paymentStatus;
    private String paymentMethod;
    private ShippingAddressResponse shippingAddress;
    private List<OrderItemResponse> items;
    private String trackingId;

    // Getters và Setters
}
