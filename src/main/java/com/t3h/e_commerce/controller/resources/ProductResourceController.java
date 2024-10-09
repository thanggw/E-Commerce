package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ApiResponse;
import com.t3h.e_commerce.dto.requests.ProductCreationRequest;
import com.t3h.e_commerce.dto.responses.ProductResponse;
import com.t3h.e_commerce.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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


}
