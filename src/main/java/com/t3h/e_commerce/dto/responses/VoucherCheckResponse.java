package com.t3h.e_commerce.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherCheckResponse {
    private boolean valid;
    private String message;
    private BigDecimal discountAmount;
    private BigDecimal totalAfterDiscount;
}

