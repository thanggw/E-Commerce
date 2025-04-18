package com.t3h.e_commerce.service.admin;

import com.t3h.e_commerce.dto.adminResponse.UpdateProductStatusRequest;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.ProductStatusEntity;
import com.t3h.e_commerce.repository.ProductRepository;
import com.t3h.e_commerce.repository.ProductStatusRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductStatusRepository productStatusRepository;

    @Transactional
    public void updateProductStatus(UpdateProductStatusRequest request) {
        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductStatusEntity status = productStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        product.setStatus(status);
        productRepository.save(product);
    }

    // Cập nhật số lượng sản phẩm
    @Transactional
    public void updateProductQuantity(Integer productId, Integer quantity) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        product.setQuantity(quantity);
        productRepository.save(product);
    }
}

