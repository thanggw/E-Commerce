package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEntity extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "review_date")
    private LocalDate reviewDate = LocalDate.now();


    private String comment;
    private int rating; // 1-5 sao
}
