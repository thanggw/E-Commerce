package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.VoucherRequest;
import com.t3h.e_commerce.dto.responses.VoucherCheckResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.entity.VoucherEntity;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.service.impl.VoucherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherResourceController {

    @Autowired
    private final VoucherServiceImpl voucherService;

    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<VoucherEntity> createVoucher(@RequestBody VoucherRequest request) {
        VoucherEntity voucher = voucherService.createVoucher(request);
        return ResponseEntity.ok(voucher);
    }

    @GetMapping
    public ResponseEntity<List<VoucherEntity>> getAllVouchers() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }

    @GetMapping("/check/{code}")
    public ResponseEntity<Boolean> checkVoucher(@PathVariable String code) {
        boolean isValid = voucherService.isVoucherValid(code);
        return ResponseEntity.ok(isValid);
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<Void> activateVoucher(@PathVariable Long id) {
        voucherService.setVoucherStatus(id, true);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<Void> deactivateVoucher(@PathVariable Long id) {
        voucherService.setVoucherStatus(id, false);
        return ResponseEntity.ok().build();
    }



}


