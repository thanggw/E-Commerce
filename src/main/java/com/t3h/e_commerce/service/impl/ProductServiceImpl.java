package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.entity.BrandEntity;
import com.t3h.e_commerce.entity.CategoryEntity;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.entity.ProductStatusEntity;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.mapper.ProductMapper;
import com.t3h.e_commerce.repository.BrandRepository;
import com.t3h.e_commerce.repository.CategoryRepository;
import com.t3h.e_commerce.repository.ProductRepository;
import com.t3h.e_commerce.repository.ProductStatusRepository;
import com.t3h.e_commerce.service.IProductService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final ProductStatusRepository productStatusRepository;
//    private  final ProductMapper2 productMapper;

    @Override
    public ResponsePage<ProductResponse> getAllProducts(ProductRequestFilter filter, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ProductEntity> productEntityPage = productRepository.searchProductEntitiesByConditions(filter, pageable);

        List<ProductResponse> productResponses = productEntityPage.getContent().stream()
                .map(product -> modelMapper.map(product, ProductResponse.class))
                .toList();

        ResponsePage<ProductResponse> responsePage = new ResponsePage<>();
        responsePage.setContent(productResponses);
        responsePage.setPageSize(productEntityPage.getSize());
        responsePage.setTotalElements(productEntityPage.getTotalElements());
        responsePage.setTotalPages(productEntityPage.getTotalPages());
        responsePage.setCurrentPage(pageable.getPageNumber());

        return responsePage;
    }

    @Override
    public ProductResponse updateProduct(Integer id, ProductUpdateRequest request) {
       ProductEntity product = productRepository.findById(id)
               .orElseThrow(() -> CustomExceptionHandler.notFoundException("Product not found with id" +id));

       product.setName(request.getName());
       product.setImage(request.getImageUrl());
       product.setDescription(request.getDescription());
       product.setPrice(request.getPrice());
       product.setQuantity(request.getQuantity());
       product.setAvailable(request.getQuantity() == 0);
       product.setLastModifiedDate(LocalDateTime.now());

       productRepository.save(product);
        return ProductMapper.toProductResponse(product);
 }

    @Override
    public ProductResponse createProduct(ProductCreationRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        if (StringUtils.isEmpty(request.getName())){
            throw CustomExceptionHandler.badRequestException("Product name is required");
        }

        if (request.getProductStatusCodeId() == null){
            throw CustomExceptionHandler.badRequestException("Product status is required");
        }

        if (request.getPrice() == null){
            throw CustomExceptionHandler.badRequestException("Product price is required");
        }

        if (request.getBrandId() == null){
            throw CustomExceptionHandler.badRequestException("Brand id is required");
        }

        if (request.getCategoryId() == null){
            throw CustomExceptionHandler.badRequestException("Category id is required");
        }

        if (request.getQuantity() == null){
            throw CustomExceptionHandler.badRequestException("Product quantity is required");
        }

        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->  CustomExceptionHandler.notFoundException("Category not found"));

        BrandEntity brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> CustomExceptionHandler.notFoundException("Brand not found"));

        ProductStatusEntity status = productStatusRepository.findById(request.getProductStatusCodeId())
                .orElseThrow(() -> CustomExceptionHandler.notFoundException(""));


        ProductEntity product = ProductMapper.toProductEntity(request);
        product.setCategory(category);
        product.setBrand(brand);

        if (request.getQuantity() <= 0){
            product.setAvailable(false);
            product.setSoldOut(false);
        }

        product.setStatus(status);
        product.setCreatedDate(LocalDateTime.now());
        product.setCreatedBy(username);
        product.setLastModifiedDate(LocalDateTime.now());
        product.setLastModifiedBy(username);

        product = productRepository.save(product);

        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public ProductResponse getById(Integer id){
        Optional<ProductEntity> pr = productRepository.findById(id);
        return productMapper.toProductResponse(pr.orElse(null));
    }
}
