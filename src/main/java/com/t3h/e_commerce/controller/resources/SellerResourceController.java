package com.t3h.e_commerce.controller.resources;


import com.t3h.e_commerce.dto.requests.BankInfoRequest;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/seller")
public class SellerResourceController {
    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/update-bank")
    public ResponseEntity<?> updateBankInfo(
            @RequestParam Integer userId, // Nhận userId từ query params
             @RequestBody BankInfoRequest bankInfoRequest) {

        userService.updateBankInfo(userId, bankInfoRequest);
        return ResponseEntity.ok("Bank information updated successfully!");
    }

    @GetMapping("/bank-info")
    public ResponseEntity<?> getBankInfo(@RequestParam Integer userId) {
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();

            // Tạo response dù thông tin ngân hàng có hay không
            Map<String, Object> bankInfo = new HashMap<>();
            bankInfo.put("bankName", user.getBankName()); // null nếu không có thông tin
            bankInfo.put("bankAccount", user.getBankAccount()); // null nếu không có thông tin

            return ResponseEntity.ok(bankInfo);
        }
        // Trả về mã 404 nếu không tìm thấy user
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng.");
    }
}
