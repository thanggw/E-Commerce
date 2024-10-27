package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/carts")
public class CartResourceController {
    private final ICartService iCartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@RequestBody AddToCartRequest request){
        return ResponseEntity.ok(iCartService.addToCart(request));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartResponse> updateCart(@PathVariable Integer itemId, @RequestBody CartItemUpdate request){
        return ResponseEntity.ok(iCartService.updateCart(itemId, request));
    }

    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<CartResponse> deleteCart(@PathVariable Integer itemId){
        return ResponseEntity.ok(iCartService.deleteCart(itemId));
    }
}
