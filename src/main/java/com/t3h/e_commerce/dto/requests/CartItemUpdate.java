package com.t3h.e_commerce.dto.requests;

import lombok.*;

@Data
@Builder
public class CartItemUpdate {
    private Integer newQuantity;
}
