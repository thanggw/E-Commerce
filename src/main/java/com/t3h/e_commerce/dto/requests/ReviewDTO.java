package com.t3h.e_commerce.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Integer productId;
    private Integer userId;
    private String username;
    private String comment;
    private int rating;
    private LocalDate reviewDate;
}
