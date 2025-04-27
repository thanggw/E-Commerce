package com.t3h.e_commerce.dto.requests;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class OrderRequest {
    private BigDecimal shippingCost;
    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;
    private String paymentMethod;
    private String voucherCode;
    private List<OrderItemRequest> items;
}

