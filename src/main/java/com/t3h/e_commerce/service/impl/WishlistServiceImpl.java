package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.AddToWishlistRequest;
import com.t3h.e_commerce.dto.responses.WishlistResponse;
import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.exception.ConflictException;
import com.t3h.e_commerce.mapper.WishlistMapper;
import com.t3h.e_commerce.repository.*;
import com.t3h.e_commerce.service.IWishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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
        // Lấy username từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm user theo username
        UserEntity user = userRepository.findByUsernameAndDeletedIsFalse(username)
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

        // Kiểm tra sản phẩm đã tồn tại trong wishlist chưa
        boolean exists = wishlist.getWishlistItems().stream().anyMatch(item ->
                item.getProduct().getId().equals(product.getId())
                        && item.getColor().getId().equals(color.getId())
                        && item.getSize().getId().equals(size.getId()));

        if (exists) {
            throw new ConflictException("Sản phẩm này đã tồn tại trong danh sách yêu thích!");        }

        // Tạo mới WishlistItemEntity
        WishlistItemEntity newWishlistItem = new WishlistItemEntity();
        newWishlistItem.setWishlist(wishlist);
        newWishlistItem.setProduct(product);
        newWishlistItem.setColor(color);
        newWishlistItem.setSize(size);

        // Thêm vào danh sách và lưu
        wishlist.getWishlistItems().add(newWishlistItem);
        wishlistItemRepository.save(newWishlistItem);
        wishlistRepository.save(wishlist);

        return wishlistMapper.toWishlistResponse(wishlist);
    }



    @Override
    public WishlistResponse getWishlistForCurrentUser() {
        // Lấy username từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm UserEntity theo username
        UserEntity user = userRepository.findByUsernameAndDeletedIsFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Lấy WishlistEntity
        WishlistEntity wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wishlist not found for user"));

        // Trả về WishlistResponse
        return wishlistMapper.toWishlistResponse(wishlist);
    }

}




