package com.t3h.e_commerce.entity;

import com.t3h.e_commerce.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@Entity
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentEntity extends BaseEntity{

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    PaymentType paymentMethod;

    @Column(name = "payment_status")
    boolean paymentStatus;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    List<OrderEntity> orders;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    UserEntity payer;

    @ManyToOne
    @JoinColumn(name = "recipient_id", referencedColumnName = "id")
    RecipientEntity payee;

}
