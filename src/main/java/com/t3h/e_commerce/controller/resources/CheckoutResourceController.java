package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.CheckoutRequest;
import com.t3h.e_commerce.dto.responses.CheckoutResponse;
import com.t3h.e_commerce.service.impl.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutResourceController {
    private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<List<CheckoutResponse>> checkout(@RequestBody CheckoutRequest request) {
        List<CheckoutResponse> responses = checkoutService.processCheckout(request);
        return ResponseEntity.ok(responses);
    }
}


