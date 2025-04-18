package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.VoucherRequest;
import com.t3h.e_commerce.entity.VoucherEntity;

import java.util.List;
import java.util.Optional;

public interface VoucherService {
    VoucherEntity createVoucher(VoucherRequest request);
    List<VoucherEntity> getAllVouchers();
    Optional<VoucherEntity> findByCode(String code);
    boolean isVoucherValid(String code);
    void setVoucherStatus(Long id, boolean active);
}

