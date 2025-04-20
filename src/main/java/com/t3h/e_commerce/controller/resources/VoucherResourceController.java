package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.requests.VoucherRequest;
import com.t3h.e_commerce.dto.responses.VoucherCheckResponse;
import com.t3h.e_commerce.dto.responses.VoucherResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.entity.VoucherEntity;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.service.impl.VoucherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherResourceController {

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

    @GetMapping("/info/{code}")
    public ResponseEntity<?> getVoucherInfo(@PathVariable String code) {
        Optional<VoucherEntity> optionalVoucher = voucherService.findByCode(code);

        if (optionalVoucher.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Voucher không tồn tại."));
        }

        VoucherEntity voucher = optionalVoucher.get();

        if (!voucher.isActive()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Voucher không hoạt động."));
        }

        if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Voucher đã hết hạn."));
        }

        VoucherResponse response = VoucherResponse.builder()
                .code(voucher.getCode())
                .discountAmount(voucher.getDiscountAmount())
                .active(voucher.isActive())
                .build();

        return ResponseEntity.ok(response);
    }



}


