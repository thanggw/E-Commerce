package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.repository.BrandRepository;
import com.t3h.e_commerce.service.IBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements IBrandService {
    private final BrandRepository brandRepository;
}
