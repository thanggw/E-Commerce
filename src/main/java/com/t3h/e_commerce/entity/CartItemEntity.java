package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;


@Entity
@Table(name = "cartitem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemEntity extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "cart_id", referencedColumnName = "id")
    CartEntity cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    ProductEntity product;

    Integer quantity;
    BigDecimal price;


    @ManyToOne
    @JoinColumn(name = "color_id") // Liên kết với bảng Color
    Color color;

    @ManyToOne
    @JoinColumn(name = "size_id")  // Liên kết với bảng Size
    Size size;

}
