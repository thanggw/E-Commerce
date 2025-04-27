package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.OrderRequest;
import com.t3h.e_commerce.dto.responses.OrderDetailResponse;
import com.t3h.e_commerce.dto.responses.OrderResponse;

import java.util.List;

public interface IOrderService {
    OrderResponse placeOrder(OrderRequest orderRequest);
    List<OrderDetailResponse> getOrdersByAuthenticatedUser();
}

