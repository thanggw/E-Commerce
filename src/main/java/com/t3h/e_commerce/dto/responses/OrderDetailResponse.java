package com.t3h.e_commerce.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private Integer orderId;
    private BigDecimal totalPrice;
    private String orderStatus;
    private String expectedDeliveryDate;
    private String trackingId;

    // Thông tin người nhận
    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;

    // Thông tin thanh toán
    private String paymentMethod;
    private Boolean paymentStatus;

    // Các sản phẩm trong đơn hàng
    private List<OrderItemResponse> orderItems;
}
