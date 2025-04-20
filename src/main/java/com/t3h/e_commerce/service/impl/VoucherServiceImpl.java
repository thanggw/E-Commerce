package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.VoucherRequest;
import com.t3h.e_commerce.entity.VoucherEntity;
import com.t3h.e_commerce.repository.VoucherRepository;
import com.t3h.e_commerce.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public VoucherEntity createVoucher(VoucherRequest request) {
        VoucherEntity voucher = new VoucherEntity();
        voucher.setCode(request.getCode());
        voucher.setDiscountAmount(request.getDiscountAmount());
        voucher.setExpirationDate(request.getExpirationDate());
        voucher.setActive(true);
        return voucherRepository.save(voucher);
    }

    @Override
    public List<VoucherEntity> getAllVouchers() {
        return voucherRepository.findAll();
    }

    @Override
    public Optional<VoucherEntity> findByCode(String code) {
        return voucherRepository.findByCodeIgnoreCaseAndActiveIsTrue(code);
    }

    @Override
    public boolean isVoucherValid(String code) {
        return voucherRepository.findByCodeAndActiveIsTrue(code)
                .filter(v -> v.getExpirationDate() == null || v.getExpirationDate().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    @Override
    public void setVoucherStatus(Long id, boolean active) {
        VoucherEntity voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
        voucher.setActive(active);
        voucherRepository.save(voucher);
    }

    public boolean hasUserUsedVoucher(Integer userId, String voucherCode) {
        Optional<VoucherEntity> voucherOpt = voucherRepository.findByCodeAndActiveIsTrue(voucherCode);
        if (voucherOpt.isEmpty()) return false;

        VoucherEntity voucher = voucherOpt.get();
        return voucherRepository.existsByUserIdAndVoucher(userId, voucher);
    }
}

