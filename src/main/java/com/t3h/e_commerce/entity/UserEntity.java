package com.t3h.e_commerce.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.t3h.e_commerce.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserEntity extends BaseEntity {
    String username;
    String password;
    String email;
    String firstName;
    String lastName;
    String phone;
    String address;
    String pathAvatar;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    @JsonManagedReference
    Set<RoleEntity> roles = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id", referencedColumnName = "id")
    private CartEntity cart;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "wishlist_id", referencedColumnName = "id")
    private WishlistEntity wishlist;

    @OneToMany(mappedBy = "payer", cascade = CascadeType.ALL)
    Set<PaymentEntity> payments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ProductEntity> products;

    private String bankName;
    private String bankAccount;
}
