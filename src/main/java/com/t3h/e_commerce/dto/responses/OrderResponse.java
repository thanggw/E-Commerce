package com.t3h.e_commerce.dto.responses;

import com.t3h.e_commerce.dto.ResponsePage;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Integer orderId;
    ResponsePage<CartItemResponse> productList;
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
