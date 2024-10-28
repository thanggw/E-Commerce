package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "order_item" )
public class OrderItemEntity extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    ProductEntity product;

    Integer quantity;
    BigDecimal price;

    Integer cartItemId;
}
