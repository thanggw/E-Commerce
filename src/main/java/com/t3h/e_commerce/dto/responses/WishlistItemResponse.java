package com.t3h.e_commerce.dto.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WishlistItemResponse {
    private Integer itemId;
    private Integer productId;
    private String productImage;
    private String productName;
    private boolean isAvailable;
    private String color;
    private String size;
}

