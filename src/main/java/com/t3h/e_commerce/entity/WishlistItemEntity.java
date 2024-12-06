package com.t3h.e_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "wishlist_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishlistItemEntity extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "wishlist_id", referencedColumnName = "id")
    WishlistEntity wishlist;

    @ManyToOne
    @JoinColumn(name = "product_id")
    ProductEntity product;

    @ManyToOne
    @JoinColumn(name = "color_id") // Liên kết với bảng Color
    Color color;

    @ManyToOne
    @JoinColumn(name = "size_id")  // Liên kết với bảng Size
    Size size;
}

