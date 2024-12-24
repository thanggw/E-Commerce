package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.CheckoutRequest;
import com.t3h.e_commerce.dto.responses.CheckoutResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.enums.OrderStatusType;
import com.t3h.e_commerce.enums.PaymentType;
import com.t3h.e_commerce.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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

    public List<CheckoutResponse> processCheckout(CheckoutRequest request) {
        List<CheckoutResponse> responses = new ArrayList<>();
        System.out.println("Payment method received: " + request.getPaymentMethod());
        // Tìm User
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found for ID: " + request.getUserId()));

        // Tạo đối tượng OrderEntity
        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setOrderStatus(OrderStatusType.Pending);
        order.setUpdateStatusDate(new Date());
        String trackingId = UUID.randomUUID().toString();
        order.setTrackingId(trackingId);
        order.setExpectedDeliveryDate(Date.from(Instant.now().plus(5, ChronoUnit.DAYS)));

        // Lưu thông tin người nhận hàng
        RecipientEntity recipient = new RecipientEntity();
        recipient.setRecipientName(request.getRecipientName());
        recipient.setPhoneNumber(request.getRecipientPhone());
        recipient.setUser(user);
        recipientRepository.save(recipient);

        // 3. Create payment entity
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

        // Liên kết Payment và Recipient vào Order
        order.setPayment(payment);
        order.setRecipient(recipient);

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
            response.setShippingCost(request.getShippingCost());
            response.setFinalPrice(productTotalPrice.add(request.getShippingCost()));
            response.setTrackingId(trackingId);
            response.setExpectedDeliveryDate(LocalDateTime.now().plusDays(5));
            responses.add(response);
        }

        // Áp dụng mã giảm giá (nếu có)
        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            totalPrice = applyVoucherDiscount(totalPrice, request.getVoucherCode());
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setShippingCost(request.getShippingCost());
        order.setFinalPrice(totalPrice.add(request.getShippingCost()));

        // Lưu OrderEntity vào database
        orderRepository.save(order);

        return responses;
    }


    private BigDecimal applyVoucherDiscount(BigDecimal totalPrice, String voucherCode) {
        // Giả lập giảm giá 10% cho mã hợp lệ
        if ("DISCOUNT10".equalsIgnoreCase(voucherCode)) {
            return totalPrice.multiply(BigDecimal.valueOf(0.90));
        }
        return totalPrice;
    }
}




