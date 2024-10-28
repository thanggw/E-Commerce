package com.t3h.e_commerce.entity;

import com.t3h.e_commerce.enums.OrderStatusType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "order_table")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderEntity extends BaseEntity {

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<OrderItemEntity> orderItems;

    @Enumerated(EnumType.STRING)
    OrderStatusType orderStatus;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_status_date")
    Date updateStatusDate;

    BigDecimal totalPrice;

    BigDecimal shippingCost;

    BigDecimal finalPrice;

    // Thêm các trường mới vào đây
    BigDecimal discount; // Thêm discount
    String trackingId; // Thêm tracking ID
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "expected_delivery_date") // Tên cột trong cơ sở dữ liệu
    Date expectedDeliveryDate; // Thêm ngày giao hàng dự kiến

    @ManyToOne
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    PaymentEntity payment;
    String paymentMethod;
    String paymentStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    UserEntity user;

    @ManyToOne
    @JoinColumn(name = "recipient_id", referencedColumnName = "id")
    RecipientEntity recipient;
}
