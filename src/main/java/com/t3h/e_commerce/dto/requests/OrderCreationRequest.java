package com.t3h.e_commerce.dto.requests;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderCreationRequest {
    private List<Integer> itemIds;
    private String address;
    private String payment;
}
