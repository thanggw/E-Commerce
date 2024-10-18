package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ApiResponse;
import com.t3h.e_commerce.dto.requests.AddToCartRequest;
import com.t3h.e_commerce.dto.requests.CartItemUpdate;
import com.t3h.e_commerce.dto.responses.CartResponse;
import com.t3h.e_commerce.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/carts")
public class CartResourceController {
    private final ICartService iCartService;

    @PostMapping("/add")
    public CartResponse addToCart(@RequestBody AddToCartRequest request,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size){
        return iCartService.addToCart(request, page, size);
    }

    @PutMapping("/update/{itemId}")
    public ApiResponse<CartResponse> updateCart(@PathVariable Integer itemId, @RequestBody CartItemUpdate request){
        return iCartService.updateCart(itemId, request);
    }

    @DeleteMapping("/delete/{itemId}")
    public ApiResponse<CartResponse> deleteCart(@PathVariable Integer itemId){
        return iCartService.deleteCart(itemId);
    }
}
