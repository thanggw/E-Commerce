package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.OrderRequest;
import com.t3h.e_commerce.dto.responses.CancelOrderResponse;
import com.t3h.e_commerce.dto.responses.OrderDetailResponse;
import com.t3h.e_commerce.dto.responses.OrderResponse;
import com.t3h.e_commerce.service.IOrderService;
import com.t3h.e_commerce.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderResourceController {

    @Autowired
    private IOrderService orderService;
    @Autowired
    private OrderServiceImpl orderServiceImpl;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestBody OrderRequest orderRequest) {
        OrderResponse response = orderService.placeOrder(orderRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderDetailResponse>> getOrdersByAuthenticatedUser() {
        List<OrderDetailResponse> orders = orderService.getOrdersByAuthenticatedUser();
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Integer orderId,
            @RequestParam String reason) {
        boolean result = orderServiceImpl.cancelOrder(orderId, reason);
        if (result) {
            return ResponseEntity.ok(new CancelOrderResponse("Hủy đơn hàng thành công"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CancelOrderResponse("Không thể hủy đơn hàng"));
        }
    }

}

