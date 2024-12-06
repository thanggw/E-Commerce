package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.OrderRequest;
import com.t3h.e_commerce.dto.responses.OrderResponse;

public interface IOrderService {
    OrderResponse placeOrder(OrderRequest orderRequest);
}

