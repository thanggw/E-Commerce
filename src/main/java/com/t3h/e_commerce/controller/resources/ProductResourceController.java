package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ApiResponse;
import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductResourceController {
    private final IProductService iProductService;

    @PostMapping("/create")
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductCreationRequest request){
        return ApiResponse.<ProductResponse>builder()
               .result(iProductService.createProduct(request))
               .build();
    }

    @GetMapping("/all-products")
    public ResponsePage<ProductResponse> getAllProducts(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ){

        ProductRequestFilter filter = new ProductRequestFilter();
                filter.setName(name);
                filter.setCategory(category);
                filter.setBrand(brand);
                filter.setMinPrice(minPrice);
                filter.setMaxPrice(maxPrice);

        return iProductService.getAllProducts(filter, page, size);
    }


    @PutMapping("/uplate/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Integer id,ProductResponse request){
        return ApiResponse.<ProductResponse>builder()
                .result(iProductService.uplateProduct(id, request))
                .build();
    }



}
