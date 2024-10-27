package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductResourceController {
    private final IProductService iProductService;

    @PostMapping("/create")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreationRequest request){
        ProductResponse productResponse = iProductService.createProduct(request);
        return ResponseEntity.ok(productResponse);
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


    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Integer id,@RequestBody ProductUpdateRequest request){
        ProductResponse productResponse = iProductService.updateProduct(id, request);
        return ResponseEntity.ok(productResponse);
    }

    @GetMapping("/get/{id}")
    public ProductResponse getProductById(@PathVariable Integer id){
        ProductResponse ps = iProductService.getById(id);
        return ResponseEntity.ok(ps).getBody();
    }



}
