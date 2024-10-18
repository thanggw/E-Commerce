package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.OrderCreationRequest;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.repository.CartItemRepository;
import com.t3h.e_commerce.repository.CartRepository;
import com.t3h.e_commerce.repository.OrderRepository;
import com.t3h.e_commerce.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public OrderResponse orderProduct(int page, int size, OrderCreationRequest request) {
        return null;
    }
}