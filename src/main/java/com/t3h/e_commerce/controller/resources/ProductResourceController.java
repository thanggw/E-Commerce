package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.ProductRequest;
import com.t3h.e_commerce.dto.requests.ProductRequestFilter;
import com.t3h.e_commerce.dto.requests.ProductUpdateRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.entity.ProductEntity;
import com.t3h.e_commerce.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductResourceController {
    private final IProductService iProductService;

    @PostMapping("/create")
    public ResponseEntity<ProductEntity> addProduct(@RequestBody ProductRequest request) {
        ProductEntity product = iProductService.addProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @GetMapping("/all-products")
    public ResponsePage<ProductResponse> getAllProducts(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "8") int size
    ){

        ProductRequestFilter filter = new ProductRequestFilter();
                filter.setName(name);
                filter.setCategory(category);
                filter.setBrand(brand);
                filter.setMinPrice(minPrice);
                filter.setMaxPrice(maxPrice);

        return iProductService.getAllProducts(filter, page, size);
    }
    @GetMapping("/search")
    public List<ProductResponse> searchProductsByName(
            @RequestParam(name = "name") String name
    ) {
        return iProductService.searchProductsByName(name);
    }

    @GetMapping("/current-user")
    public ResponseEntity<List<ProductResponse>> getProductsByCurrentUser() {
        List<ProductResponse> products = iProductService.getProductsByCurrentUser();
        return ResponseEntity.ok(products);
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Integer id,@RequestBody ProductUpdateRequest request){
        ProductResponse productResponse = iProductService.updateProduct(id, request);
        return ResponseEntity.ok(productResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) {
        ProductResponse productResponse = iProductService.getProductById(id);
        return ResponseEntity.ok(productResponse);
    }
}
