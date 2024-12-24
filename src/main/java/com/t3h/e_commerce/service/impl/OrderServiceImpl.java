package com.t3h.e_commerce.service.impl;


import com.t3h.e_commerce.dto.requests.OrderRequest;
import com.t3h.e_commerce.dto.responses.OrderDetailResponse;
import com.t3h.e_commerce.dto.responses.OrderItemResponse;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.enums.PaymentType;
import com.t3h.e_commerce.mapper.OrderMapper;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public OrderResponse placeOrder(OrderRequest orderRequest) {
        System.out.println("Payment method received: " + orderRequest.getPaymentMethod());
        // 1. Fetch user
        UserEntity user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Create recipient
        RecipientEntity recipient = new RecipientEntity();
        recipient.setRecipientName(orderRequest.getRecipientName());
        recipient.setPhoneNumber(orderRequest.getRecipientPhone());
        recipient.setUser(user);
        recipientRepository.save(recipient);

        // 3. Create payment entity
        PaymentEntity payment = new PaymentEntity();
        PaymentType paymentType = PaymentType.valueOf(orderRequest.getPaymentMethod());
        payment.setPaymentMethod(paymentType);

        // Set paymentStatus based on PaymentMethod
        if (paymentType == PaymentType.COD) {
            payment.setPaymentStatus(false);
        } else {
            payment.setPaymentStatus(true);
        }

        payment.setPayer(user);
        payment.setPayee(recipient);
        paymentRepository.save(payment);


        // 4. Calculate final price (apply discounts, shipping, etc.)
        BigDecimal finalPrice = calculateFinalPrice(user.getCart());

        // 5. Calculate or set shipping cost, expected delivery date, and tracking ID
        BigDecimal shippingCost = calculateShippingCost(); // Tính toán phí vận chuyển
        Date expectedDeliveryDate = calculateExpectedDeliveryDate(); // Tính toán ngày giao hàng dự kiến
        String trackingId = generateTrackingId(); // Sinh mã vận đơn ngẫu nhiên

        // 6. Create order
        OrderEntity order = OrderMapper.mapToOrderEntity(orderRequest, user, payment, recipient, finalPrice);
        order.setShippingCost(shippingCost);
        order.setExpectedDeliveryDate(expectedDeliveryDate);
        order.setTrackingId(trackingId);
        // Add OrderItems from the cart
        List<OrderItemEntity> orderItems = user.getCart().getCartItems().stream()
                .filter(cartItem -> !cartItem.getDeleted())
                .map(cartItem -> {
                    OrderItemEntity orderItem = new OrderItemEntity();
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    orderItem.setOrder(order); // Liên kết OrderItemEntity với OrderEntity
                    return orderItem;
                }).collect(Collectors.toList());

// Liên kết danh sách orderItems với OrderEntity
        order.setOrderItems(orderItems);
        orderRepository.save(order);

        // 7. Convert to response
        return OrderMapper.mapToOrderResponse(order);

    }

    private BigDecimal calculateFinalPrice(CartEntity cart) {
        BigDecimal totalPrice = cart.getCartItems().stream()
                .filter(item -> !item.getDeleted())
                .map(item -> item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalPrice.add(new BigDecimal(30));
    }

    // Method to calculate the shipping cost (example: default 50.000 VND)
    private BigDecimal calculateShippingCost() {
        return new BigDecimal("30"); // Giá vận chuyển mặc định
    }

    // Method to calculate expected delivery date (example: 5 days from the current date)
    private Date calculateExpectedDeliveryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, 5); // Giao hàng sau 5 ngày
        return calendar.getTime();
    }

    // Method to generate a random tracking ID
    private String generateTrackingId() {
        return UUID.randomUUID().toString(); // Sinh mã vận đơn ngẫu nhiên
    }



    public List<OrderDetailResponse> getOrdersByUserId(Integer userId) {
        List<OrderEntity> orders = orderRepository.findByUserId(userId);
        if (orders.isEmpty()) {
            throw new NoSuchElementException("No orders found for user ID: " + userId);
        }

        return orders.stream()
                .map(order -> OrderDetailResponse.builder()
                        .orderId(order.getId())
                        .totalPrice(order.getTotalPrice())
                        .orderStatus(order.getOrderStatus().name())
                        .expectedDeliveryDate(order.getExpectedDeliveryDate().toString())
                        .trackingId(order.getTrackingId())
                        .recipientName(order.getRecipient().getRecipientName())
                        .recipientPhone(order.getRecipient().getPhoneNumber())
                        .recipientAddress(order.getRecipient().getUser().getAddress())
                        .paymentMethod(order.getPayment().getPaymentMethod().name())
                        .paymentStatus(order.getPayment().isPaymentStatus())
                        .orderItems(order.getOrderItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                        .productName(item.getProduct().getName())
                                        .quantity(item.getQuantity())
                                        .pricePerUnit(item.getPrice())
                                        .totalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                                        .build())
                                .toList())
                        .build())
                .toList();
    }


}



