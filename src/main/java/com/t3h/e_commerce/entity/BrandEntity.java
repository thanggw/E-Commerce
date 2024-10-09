package com.t3h.e_commerce.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "brand")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandEntity extends BaseEntity{
    String code;
    String description;

    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL)
    List<ProductEntity> products;
}
