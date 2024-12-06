package com.t3h.e_commerce.dto.responses;

import com.t3h.e_commerce.dto.ResponsePage;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    private Integer cartId;
    private Integer totalQuantity;
    private BigDecimal totalPrice;
    private List<CartItemResponse> items;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime lastModifiedDate;
    String lastModifiedBy;
    Boolean deleted;
}
