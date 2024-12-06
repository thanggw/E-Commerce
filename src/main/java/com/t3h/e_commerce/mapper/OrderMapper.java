package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.requests.OrderRequest;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.entity.OrderEntity;
import com.t3h.e_commerce.entity.PaymentEntity;
import com.t3h.e_commerce.entity.RecipientEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.enums.OrderStatusType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

    public class OrderMapper {

        public static OrderEntity mapToOrderEntity(OrderRequest request, UserEntity user, PaymentEntity payment, RecipientEntity recipient, BigDecimal finalPrice) {
            OrderEntity order = new OrderEntity();
            order.setUser(user);
            order.setPayment(payment);
            order.setRecipient(recipient);
            order.setTotalPrice(finalPrice);
            order.setOrderStatus(OrderStatusType.Pending);
            order.setFinalPrice(finalPrice); // Assuming no extra calculation for now
            order.setCreatedDate(LocalDateTime.now());
            order.setLastModifiedDate(LocalDateTime.now());
            return order;
        }

        public static OrderResponse mapToOrderResponse(OrderEntity order) {
            OrderResponse response = new OrderResponse();
            response.setOrderId(order.getId());
            response.setTotalPrice(order.getFinalPrice());
            response.setOrderStatus(order.getOrderStatus().toString());
            response.setExpectedDeliveryDate(
                    order.getExpectedDeliveryDate() != null ? order.getExpectedDeliveryDate().toString() : "N/A"
            );
            response.setMessage("Order placed successfully");
            return response;
        }

    }

