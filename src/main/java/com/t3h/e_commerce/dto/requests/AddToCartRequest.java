package com.t3h.e_commerce.dto.requests;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddToCartRequest {
    private Integer productId;
    private Integer quantity;
    private Integer colorId;
    private Integer sizeId;
}
