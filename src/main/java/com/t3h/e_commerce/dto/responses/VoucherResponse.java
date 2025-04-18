package com.t3h.e_commerce.dto.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherResponse {
    private String code;
    private BigDecimal discountAmount;
    private boolean active;
}

