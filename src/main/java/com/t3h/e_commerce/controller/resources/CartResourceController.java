package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carts")
public class CartResourceController {
    @Autowired
    private ICartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@RequestBody AddToCartRequest request) {
        CartResponse cartResponse = cartService.addToCart(request);
        return ResponseEntity.ok(cartResponse);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Integer userId) {
        CartResponse cartResponse = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<String> removeItemFromCart(@PathVariable Integer userId, @PathVariable Integer productId) {
        boolean isRemoved = cartService.removeItemFromCart(userId, productId);

        if (isRemoved) {
            return ResponseEntity.ok("Sản phẩm đã được xóa khỏi giỏ hàng.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy sản phẩm trong giỏ hàng.");
        }
    }
}
