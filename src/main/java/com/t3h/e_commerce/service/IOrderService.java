package com.t3h.e_commerce.service;


import com.t3h.e_commerce.dto.requests.OrderCreationRequest;
import com.t3h.e_commerce.dto.responses.OrderResponse;

public interface IOrderService {
    OrderResponse orderProduct(int page, int size, OrderCreationRequest request);
}