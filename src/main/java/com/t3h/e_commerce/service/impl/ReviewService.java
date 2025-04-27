package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.ReviewDTO;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.ReviewEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.repository.OrderItemRepository;
import com.t3h.e_commerce.repository.ProductRepository;
import com.t3h.e_commerce.repository.ReviewRepository;
import com.t3h.e_commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public List<ReviewDTO> getReviewsByProduct(Integer productId) {
        List<ReviewEntity> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream().map(review -> new ReviewDTO(
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getComment(),
                review.getRating(),
                review.getReviewDate()
        )).collect(Collectors.toList());

    }

    public ReviewDTO addReview(ReviewDTO reviewDTO) {
        UserEntity user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ProductEntity product = productRepository.findById(reviewDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean hasBought = orderItemRepository.existsByOrder_User_IdAndProduct_Id(
                reviewDTO.getUserId(), reviewDTO.getProductId());
        if (!hasBought) {
            throw new RuntimeException("User chưa mua sản phẩm này nên không thể đánh giá.");
        }

        ReviewEntity review = new ReviewEntity();
        review.setUser(user);
        review.setProduct(product);
        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());
        review.setReviewDate(LocalDate.now());

        ReviewEntity savedReview = reviewRepository.save(review);
        return new ReviewDTO(
                savedReview.getProduct().getId(),
                savedReview.getUser().getId(),
                savedReview.getUser().getUsername(),
                savedReview.getComment(),
                savedReview.getRating(),
                savedReview.getReviewDate()
        );
    }
}

