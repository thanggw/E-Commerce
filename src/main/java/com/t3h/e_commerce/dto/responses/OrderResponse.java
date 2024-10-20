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
    Integer orderId;
    List<CartItemResponse> productList;
    Integer totalQuantity;
    BigDecimal totalPrice;
    LocalDateTime orderDate;
    String orderPlacedBy;
    String orderStatus;
    BigDecimal shippingCost;
    //    PaymentResponse payment;
    boolean paymentSuccess;
    String paymentAnnounce;
    String address;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime lastModifiedDate;
    String lastModifiedBy;
    Boolean deleted;
}

