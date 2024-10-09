package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "cart")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartEntity extends BaseEntity{

    @OneToOne(mappedBy = "cart")
    UserEntity user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    List<CartItemEntity> cartItems;

    Integer totalQuantity;
}
