package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.AddToWishlistRequest;
import com.t3h.e_commerce.dto.responses.WishlistResponse;
import com.t3h.e_commerce.service.impl.WishlistServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistResourceController {

    @Autowired
    private WishlistServiceImpl wishlistService;

    /**
     * Thêm sản phẩm vào danh sách yêu thích
     *
     * @param request DTO chứa thông tin user, sản phẩm, màu sắc và kích thước
     * @return ResponseEntity với thông báo thành công
     */
    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(@RequestBody AddToWishlistRequest request) {
        wishlistService.addToWishlist(request);
        return ResponseEntity.ok("Product added to wishlist successfully");
    }


    /**
     * Lấy thông tin wishlist theo userId
     *
     * @param userId ID của người dùng
     * @return ResponseEntity chứa danh sách wishlist
     */
    @GetMapping("/{userId}")
    public ResponseEntity<WishlistResponse> getWishlistByUserId(@PathVariable Integer userId) {
        WishlistResponse wishlistResponse = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlistResponse);
    }
}

