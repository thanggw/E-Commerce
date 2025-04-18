package com.t3h.e_commerce.dto.adminResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductStatusRequest {
    private Integer productId;
    private Integer statusId;
}

