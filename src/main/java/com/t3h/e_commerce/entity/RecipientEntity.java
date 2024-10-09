package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "recipient")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecipientEntity extends BaseEntity{
    String recipientName;
    String phoneNumber;
    String recipientEmail;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    UserEntity user;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    List<OrderEntity> orders;

    @OneToMany(mappedBy = "payee", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PaymentEntity> payments;

}
