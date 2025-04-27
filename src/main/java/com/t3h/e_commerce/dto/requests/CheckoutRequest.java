package com.t3h.e_commerce.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    // Đã bỏ userId
    private BigDecimal shippingCost;
    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;
    private String paymentMethod;
    private String voucherCode;
    private List<ItemRequest> items;

    @Getter @Setter
    public static class ItemRequest {
        private Integer productId;
        private Integer colorId;
        private Integer sizeId;
        private Integer quantity;
    }
}


