package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.responses.WishlistItemResponse;
import com.t3h.e_commerce.dto.responses.WishlistResponse;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.ProductImage;
import com.t3h.e_commerce.entity.WishlistEntity;
import com.t3h.e_commerce.entity.WishlistItemEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class WishlistMapper {

    public WishlistResponse toWishlistResponse(WishlistEntity wishlist) {
        return WishlistResponse.builder()
                .wishlistId(wishlist.getId())
                .items(wishlist.getWishlistItems() != null
                        ? wishlist.getWishlistItems().stream().map(this::toWishlistItemResponse).collect(Collectors.toList())
                        : new ArrayList<>())
                .createdDate(wishlist.getCreatedDate())
                .createdBy(wishlist.getCreatedBy())
                .lastModifiedDate(wishlist.getLastModifiedDate())
                .lastModifiedBy(wishlist.getLastModifiedBy())
                .build();
    }

    private WishlistItemResponse toWishlistItemResponse(WishlistItemEntity item) {
        ProductEntity product = item.getProduct();

        return WishlistItemResponse.builder()
                .itemId(item.getId())
                .productId(product.getId())
                .productImage(getMainImageUrl(product)) // Sử dụng hàm helper để lấy ảnh chính
                .productName(product.getName())
                .isAvailable(product.isAvailable() && !product.isSoldOut()) // Kiểm tra trạng thái sẵn có
                .color(item.getColor() != null ? item.getColor().getName() : null)
                .size(item.getSize() != null ? item.getSize().getName() : null)
                .build();
    }

    /**
     * Lấy URL của ảnh chính từ danh sách ảnh sản phẩm.
     *
     * @param product Thực thể sản phẩm
     * @return URL của ảnh chính hoặc null nếu không có ảnh nào
     */
    private String getMainImageUrl(ProductEntity product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }
        return product.getImages().stream()
                .filter(ProductImage::getIsMain) // Chỉ lấy ảnh chính
                .map(ProductImage::getImageUrl) // Lấy URL
                .findFirst() // Lấy ảnh đầu tiên
                .orElse(null); // Nếu không có ảnh chính, trả về null
    }
}




