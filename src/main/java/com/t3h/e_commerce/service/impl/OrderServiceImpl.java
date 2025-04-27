package com.t3h.e_commerce.service.impl;


import com.t3h.e_commerce.dto.requests.OrderRequest;
import com.t3h.e_commerce.dto.responses.OrderDetailResponse;
import com.t3h.e_commerce.dto.responses.OrderItemResponse;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.enums.OrderStatusType;
import com.t3h.e_commerce.enums.PaymentType;
import com.t3h.e_commerce.exception.BadRequestException;
import com.t3h.e_commerce.mapper.OrderMapper;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.IOrderService;
import com.t3h.e_commerce.service.admin.BusinessHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherServiceImpl voucherService;

    @Autowired
    private BusinessHourService businessHourService;

    @Override
    public OrderResponse placeOrder(OrderRequest orderRequest) {
        // 1. Lấy user từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Kiểm tra giờ mở cửa
        if (!businessHourService.isRestaurantOpen()) {
            throw new RuntimeException("Nhà hàng hiện đang đóng cửa");
        }

        // 3. Tạo recipient
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


        VoucherEntity voucher = null;
        if (orderRequest.getVoucherCode() != null && !orderRequest.getVoucherCode().isEmpty()) {
            voucher = voucherService.findByCode(orderRequest.getVoucherCode())
                    .orElseThrow(() -> new BadRequestException("Voucher không tồn tại"));

            // Kiểm tra nếu user đã từng dùng voucher này
            if (voucherService.hasUserUsedVoucher(user.getId(), orderRequest.getVoucherCode())) {
                throw new BadRequestException("Bạn đã sử dụng voucher này rồi!");
            }
        }


        // 4. Calculate final price (apply discounts, shipping, etc.)
        BigDecimal finalPrice = calculateFinalPrice(user.getCart(), voucher);

        // 5. Calculate or set shipping cost, expected delivery date, and tracking ID
        BigDecimal shippingCost = calculateShippingCost(); // Tính toán phí vận chuyển
        Date expectedDeliveryDate = calculateExpectedDeliveryDate(); // Tính toán ngày giao hàng dự kiến
        String trackingId = generateTrackingId(); // Sinh mã vận đơn ngẫu nhiên

        // 6. Create order
        OrderEntity order = OrderMapper.mapToOrderEntity(orderRequest, user, payment, recipient, finalPrice);
        order.setShippingCost(shippingCost);
        order.setExpectedDeliveryDate(expectedDeliveryDate);
        order.setTrackingId(trackingId);
        order.setVoucher(voucher);
        order.setDiscount(voucher != null ? voucher.getDiscountAmount() : BigDecimal.ZERO);
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

    private BigDecimal calculateFinalPrice(CartEntity cart, VoucherEntity voucher) {
        BigDecimal totalPrice = cart.getCartItems().stream()
                .filter(item -> !item.getDeleted())
                .map(item -> item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = (voucher != null && voucher.isActive() &&
                (voucher.getExpirationDate() == null || voucher.getExpirationDate().isAfter(LocalDateTime.now())))
                ? voucher.getDiscountAmount() : BigDecimal.ZERO;

        return totalPrice.subtract(discount).max(BigDecimal.ZERO).add(calculateShippingCost());
    }


    // Method to calculate the shipping cost (example: default 50.000 VND)
    private BigDecimal calculateShippingCost() {
        return new BigDecimal("10"); // Giá vận chuyển mặc định
    }

    // Method to calculate expected delivery date (example: 5 days from the current date)
    private Date calculateExpectedDeliveryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, 1); // Giao hàng sau 5 ngày
        return calendar.getTime();
    }

    // Method to generate a random tracking ID
    private String generateTrackingId() {
        return UUID.randomUUID().toString(); // Sinh mã vận đơn ngẫu nhiên
    }



    @Override
    public List<OrderDetailResponse> getOrdersByAuthenticatedUser() {
        // Lấy username từ SecurityContextHolder
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || "anonymousUser".equals(username)) {
            throw new IllegalStateException("User not authenticated");
        }

        // Tìm UserEntity theo username
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Lấy userId từ UserEntity
        Integer userId = user.getId();

        // Lấy danh sách đơn hàng theo userId
        List<OrderEntity> orders = orderRepository.findByUserId(userId);
        if (orders.isEmpty()) {
            throw new NoSuchElementException("No orders found for user: " + username);
        }

        // Chuyển đổi danh sách đơn hàng thành OrderDetailResponse
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



    @Transactional
    public boolean updateOrderStatus(Integer orderId, OrderStatusType status) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setOrderStatus(status);
                    order.setUpdateStatusDate(new Date());

                    if (isCanceledStatus(status)) {
                        order.setCancelReason("Hủy bởi admin");
                    }

                    orderRepository.save(order);
                    return true;
                })
                .orElse(false);
    }

    private boolean isCanceledStatus(OrderStatusType status) {
        return status == OrderStatusType.Canceled || status == OrderStatusType.CANCELLED;
    }


    public List<OrderDetailResponse> getAllOrders() {
        List<OrderEntity> orders = orderRepository.findAll();
        return orders.stream().map(this::mapToOrderDetailResponse).collect(Collectors.toList());
    }

    private OrderDetailResponse mapToOrderDetailResponse(OrderEntity order) {
        return OrderDetailResponse.builder()
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
                .build();
    }

    @Transactional
    public boolean cancelOrder(Integer orderId, String reason) {
        Optional<OrderEntity> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            OrderEntity order = optionalOrder.get();

            // Kiểm tra chỉ cho phép hủy nếu đơn hàng chưa giao hoặc đang xử lý
            if (order.getOrderStatus() == OrderStatusType.Pending || order.getOrderStatus() == OrderStatusType.Processing) {
                order.setOrderStatus(OrderStatusType.CANCELLED); // bạn phải có thêm enum CANCELLED trong OrderStatusType
                order.setCancelReason(reason);
                order.setUpdateStatusDate(new Date());
                orderRepository.save(order);
                return true;
            }
        }
        return false;
    }


}



