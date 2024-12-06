package com.t3h.e_commerce.mapper;

import com.t3h.e_commerce.dto.requests.ProductRequest;
import com.t3h.e_commerce.dto.responses.ColorResponse;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.dto.responses.SizeResponse;
import com.t3h.e_commerce.entity.*;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProductMapper {
    public static ProductResponse toProductResponse(ProductEntity product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .colors(product.getColors().stream()
                        .map(color -> new ColorResponse(color.getId(), color.getName()))
                        .collect(Collectors.toSet()))
                .sizes(product.getSizes().stream()
                        .map(size -> new SizeResponse(size.getId(), size.getName()))
                        .collect(Collectors.toSet()))
                .imageUrls(product.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList()))
                .quantity(product.getQuantity())
                .brand(BrandMapper.INSTANCE.toResponse(product.getBrand()))
                .category(CategoryMapper.INSTANCE.toResponse(product.getCategory()))
                .status(ProductStatusMapper.INSTANCE.toResponse(product.getStatus()))
                .build();
    }


}

