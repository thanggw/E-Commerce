package com.t3h.e_commerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherEntity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private BigDecimal discountAmount;

    @Column
    private LocalDateTime expirationDate;

    @Column
    private boolean active = true;


}

