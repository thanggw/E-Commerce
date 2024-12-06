package com.t3h.e_commerce.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;


@Entity
@Table(name = "productstatus")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductStatusEntity extends BaseEntity {
    String code;
    String description;

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    List<ProductEntity> products;
}
