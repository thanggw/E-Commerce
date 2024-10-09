package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.service.IBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/brands")
public class BrandResourceController {
    private final IBrandService iBrandService;
}
