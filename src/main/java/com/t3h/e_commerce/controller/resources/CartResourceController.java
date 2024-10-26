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
    public ResponseEntity<CartResponse> addToCart(@RequestBody AddToCartRequest request,
                                                 @RequestParam(name = "page", defaultValue = "0") int page,
                                                 @RequestParam(name = "size", defaultValue = "10") int size){
        CartResponse cartResponse = iCartService.addToCart(request, page, size);

        return ResponseEntity.ok(cartResponse);
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartResponse> updateCart(@PathVariable Integer itemId, @RequestBody CartItemUpdate request,
                                                  @RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "10") int size){
        CartResponse cartResponse = iCartService.updateCart(itemId, request, page, size);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<CartResponse> deleteCart(@PathVariable Integer itemId){
        CartResponse cartResponse = iCartService.deleteCart(itemId);
        return ResponseEntity.ok(cartResponse);
    }
}
