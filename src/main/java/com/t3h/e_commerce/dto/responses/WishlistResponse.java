package com.t3h.e_commerce.dto.responses;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WishlistResponse {
    private Integer wishlistId;
    private List<WishlistItemResponse> items;
    private LocalDateTime createdDate;
    private String createdBy;
    private LocalDateTime lastModifiedDate;
    private String lastModifiedBy;
}

