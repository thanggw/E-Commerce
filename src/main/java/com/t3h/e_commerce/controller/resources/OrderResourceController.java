package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.OrderCreationRequest;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderResourceController {
    private final IOrderService iOrderService;

    @PostMapping("/add")
    public OrderResponse orderProduct(@RequestBody OrderCreationRequest request,
                                      @RequestParam(name = "page", defaultValue = "0") int page,
                                      @RequestParam(name = "size", defaultValue = "10") int size) {
        return iOrderService.orderProduct(page, size, request);
    }
}