package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.AddToWishlistRequest;
import com.t3h.e_commerce.dto.responses.WishlistResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.mapper.WishlistMapper;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.IWishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements IWishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ColorRespository colorRepository;

    @Autowired
    private SizeRepository sizeRepository;

    private final WishlistMapper wishlistMapper;

    @Override
    public WishlistResponse addToWishlist(AddToWishlistRequest request) {
        // Lấy thông tin người dùng
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Lấy hoặc tạo Wishlist
        WishlistEntity wishlist = wishlistRepository.findByUserId(user.getId()).orElseGet(() -> {
            WishlistEntity newWishlist = new WishlistEntity();
            newWishlist.setUser(user);
            return newWishlist;
        });

        // Lấy thông tin sản phẩm
        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Lấy thông tin color và size
        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new IllegalArgumentException("Color not found"));
        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new IllegalArgumentException("Size not found"));

        // Kiểm tra xem sản phẩm đã tồn tại trong wishlist chưa
        boolean exists = wishlist.getWishlistItems().stream().anyMatch(item ->
                item.getProduct().getId().equals(product.getId())
                        && item.getColor().getId().equals(color.getId())
                        && item.getSize().getId().equals(size.getId()));

        if (exists) {
            throw new IllegalArgumentException("Item already exists in wishlist");
        }

        // Tạo mới WishlistItemEntity
        WishlistItemEntity newWishlistItem = new WishlistItemEntity();
        newWishlistItem.setWishlist(wishlist);
        newWishlistItem.setProduct(product);
        newWishlistItem.setColor(color);
        newWishlistItem.setSize(size);

        // Thêm vào danh sách và lưu
        wishlist.getWishlistItems().add(newWishlistItem);
        wishlistItemRepository.save(newWishlistItem); // Lưu mới vào repository
        wishlistRepository.save(wishlist); // Cập nhật wishlist

        return wishlistMapper.toWishlistResponse(wishlist);
    }


    @Override
    public WishlistResponse getWishlistByUserId(Integer userId) {
        // Lấy thông tin người dùng
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Lấy thông tin wishlist của người dùng
        WishlistEntity wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wishlist not found for user"));

        // Chuyển đổi entity sang response
        return wishlistMapper.toWishlistResponse(wishlist);
    }
}




