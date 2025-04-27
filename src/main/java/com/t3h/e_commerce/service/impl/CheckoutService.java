package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.CheckoutRequest;
import com.t3h.e_commerce.dto.responses.CheckoutResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.enums.OrderStatusType;
import com.t3h.e_commerce.enums.PaymentType;
import com.t3h.e_commerce.exception.BadRequestException;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.admin.BusinessHourService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CheckoutService {
    private final ProductRepository productRepository;
    private final ColorRespository colorRepository;
    private final SizeRepository sizeRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RecipientRepository recipientRepository;
    private final PaymentRepository paymentRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherServiceImpl voucherService;
    private final BusinessHourService businessHourService;

    @Transactional
    public List<CheckoutResponse> processCheckout(CheckoutRequest request) {
        // 1. Kiểm tra giờ mở cửa
        if (!businessHourService.isRestaurantOpen()) {
            throw new RuntimeException("Nhà hàng hiện đang đóng cửa");
        }

        List<CheckoutResponse> responses = new ArrayList<>();
        // 2. Lấy user từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Tạo order
        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setOrderStatus(OrderStatusType.Pending);
        order.setUpdateStatusDate(new Date());
        String trackingId = generateTrackingId();
        order.setTrackingId(trackingId);
        order.setExpectedDeliveryDate(calculateExpectedDeliveryDate());

        // 4. Lưu thông tin người nhận hàng
        RecipientEntity recipient = new RecipientEntity();
        recipient.setRecipientName(request.getRecipientName());
        recipient.setPhoneNumber(request.getRecipientPhone());
        recipient.setUser(user);
        recipientRepository.save(recipient);

        // 5. Tạo payment entity
        PaymentEntity payment = new PaymentEntity();
        PaymentType paymentType = PaymentType.valueOf(request.getPaymentMethod());
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

        // 6. Xử lý voucher nếu có
        VoucherEntity voucher = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            voucher = voucherService.findByCode(request.getVoucherCode())
                    .orElseThrow(() -> new BadRequestException("Voucher không tồn tại"));

            // Kiểm tra nếu user đã từng dùng voucher này
            if (voucherService.hasUserUsedVoucher(user.getId(), request.getVoucherCode())) {
                throw new BadRequestException("Bạn đã sử dụng voucher này rồi!");
            }
        }

        // 7. Tính toán giá trị đơn hàng
        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItemEntity> orderItems = new ArrayList<>();

        // Duyệt qua các items
        for (CheckoutRequest.ItemRequest item : request.getItems()) {
            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found for ID: " + item.getProductId()));
            Color color = colorRepository.findById(item.getColorId())
                    .orElseThrow(() -> new RuntimeException("Color not found for ID: " + item.getColorId()));
            Size size = sizeRepository.findById(item.getSizeId())
                    .orElseThrow(() -> new RuntimeException("Size not found for ID: " + item.getSizeId()));

            BigDecimal productTotalPrice = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalPrice = totalPrice.add(productTotalPrice);

            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);

            // Tạo CheckoutResponse
            CheckoutResponse response = new CheckoutResponse();
            response.setProductName(product.getName());
            response.setImageUrl(product.getImages().stream()
                    .filter(ProductImage::getIsMain)
                    .findFirst()
                    .map(ProductImage::getImageUrl)
                    .orElse("Default Image URL"));
            response.setColor(color.getName());
            response.setSize(size.getName());
            response.setQuantity(item.getQuantity());
            response.setTotalPrice(productTotalPrice);
            response.setShippingCost(calculateShippingCost());
            response.setFinalPrice(productTotalPrice.add(calculateShippingCost()));
            response.setTrackingId(trackingId);
            response.setExpectedDeliveryDate(LocalDateTime.now().plusDays(1));
            responses.add(response);
        }

        // 8. Áp dụng voucher nếu có
        BigDecimal discountAmount = voucher != null ? voucher.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal finalPrice = totalPrice.subtract(discountAmount).max(BigDecimal.ZERO).add(calculateShippingCost());

        // 9. Cập nhật thông tin đơn hàng
        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setShippingCost(calculateShippingCost());
        order.setFinalPrice(finalPrice);
        order.setPayment(payment);
        order.setRecipient(recipient);
        order.setVoucher(voucher);
        order.setDiscount(discountAmount);

        // 10. Lưu OrderEntity vào database
        orderRepository.save(order);

        return responses;
    }

    // Các phương thức helper giống như trong OrderServiceImpl
    private BigDecimal calculateShippingCost() {
        return new BigDecimal("10"); // Giá vận chuyển mặc định
    }

    private Date calculateExpectedDeliveryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, 1); // Giao hàng sau 1 ngày
        return calendar.getTime();
    }

    private String generateTrackingId() {
        return UUID.randomUUID().toString(); // Sinh mã vận đơn ngẫu nhiên
    }
}




