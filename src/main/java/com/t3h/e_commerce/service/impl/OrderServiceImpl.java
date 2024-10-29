package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.OrderCreationRequest;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.entity.CartItemEntity;
import com.t3h.e_commerce.entity.OrderEntity;
import com.t3h.e_commerce.entity.OrderItemEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.enums.OrderStatusType;
import com.t3h.e_commerce.repository.CartItemRepository;
import com.t3h.e_commerce.repository.OrderRepository;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.service.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Override
    public OrderResponse orderProduct(OrderCreationRequest request) {
        // Lấy thông tin user dựa trên userId từ request
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        // Lấy cart items từ repository dựa trên itemIds
        List<OrderItemEntity> orderItems = request.getItemIds().stream()
                .map(cartItemRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(this::mapToOrderItemEntity)
                .collect(Collectors.toList());

        if (orderItems.isEmpty()) {
            throw new IllegalArgumentException("Bạn vẫn chưa chọn sản phẩm nào để mua.");
        }

        // Tính toán tổng giá tiền và phí vận chuyển
        BigDecimal totalPrice = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shippingCost = calculateShippingCost(totalPrice);

        // Giả định có một discount cố định (bạn có thể thay đổi theo logic cụ thể của bạn)
        BigDecimal discount = BigDecimal.valueOf(10.0); // Ví dụ: giảm giá 10.0

        // Tạo và lưu OrderEntity
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderItems(orderItems);
        orderEntity.setTotalPrice(totalPrice);
        orderEntity.setShippingCost(shippingCost);
        orderEntity.setDiscount(discount); // Thiết lập discount
        orderEntity.setFinalPrice(totalPrice.add(shippingCost).subtract(discount)); // Tính final price
        orderEntity.setOrderStatus(OrderStatusType.Pending);
        orderEntity.setCreatedDate(LocalDateTime.now());
        orderEntity.setUser(user);
        orderEntity.setPaymentMethod(request.getPaymentMethod()); // Thiết lập paymentMethod
        orderEntity.setPaymentStatus("PENDING");


        // Thêm tracking ID và ngày giao hàng dự kiến
        orderEntity.setTrackingId("TRACK123456");
        orderEntity.setExpectedDeliveryDate(Date.from(LocalDateTime.now().plusDays(5).atZone(ZoneId.systemDefault()).toInstant())); // Thiết lập ngày giao hàng dự kiến // Giao hàng trong 5 ngày

        OrderEntity savedOrder = orderRepository.save(orderEntity);

        // Trả về OrderResponse
        return mapToOrderResponse(savedOrder);
    }

    private OrderResponse mapToOrderResponse(OrderEntity orderEntity) {
        return OrderResponse.builder()
                .orderId(Long.valueOf(orderEntity.getId()))
                .totalQuantity(orderEntity.getOrderItems().size())
                .totalPrice(orderEntity.getTotalPrice())
                .shippingCost(orderEntity.getShippingCost())
                .discount(orderEntity.getDiscount().doubleValue()) // Thêm discount vào response
                .finalPrice(orderEntity.getFinalPrice().doubleValue()) // Thêm final price vào response
                .trackingId(orderEntity.getTrackingId()) // Thêm tracking ID vào response
                .expectedDeliveryDate(convertDateToLocalDateTime(orderEntity.getExpectedDeliveryDate())) // Chuyển đổi từ Date sang LocalDateTime // Thêm ngày giao hàng vào response
                .orderStatus(orderEntity.getOrderStatus().name())
                .orderPlacedBy(orderEntity.getUser().getLastName())
                .paymentStatus(orderEntity.getPaymentStatus())
                .paymentMethod(orderEntity.getPaymentMethod())
                .createdDate(orderEntity.getCreatedDate())
                .build();
    }
    private LocalDateTime convertDateToLocalDateTime(Date date) {
        return date.toInstant() // Chuyển đổi Date thành Instant
                .atZone(ZoneId.systemDefault()) // Chọn múi giờ hiện tại
                .toLocalDateTime(); // Chuyển đổi thành LocalDateTime
    }

    private OrderItemEntity mapToOrderItemEntity(CartItemEntity cartItem) {
        OrderItemEntity orderItem = new OrderItemEntity();
        orderItem.setProduct(cartItem.getProduct());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setPrice(cartItem.getPrice());
        return orderItem;
    }

    private BigDecimal calculateShippingCost(BigDecimal totalPrice) {
        return BigDecimal.valueOf(50); // Phí vận chuyển cố định
    }
}