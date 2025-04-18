package com.t3h.e_commerce.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherRequest {
    private String code;
    private BigDecimal discountAmount;
    private LocalDateTime expirationDate;
}

