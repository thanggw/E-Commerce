package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.enums.Bank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/banks")
public class BankResourceController {

    @GetMapping
    public ResponseEntity<List<String>> getAllBanks() {
        List<String> banks = Arrays.stream(Bank.values())
                .map(Bank::getBankName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(banks);
    }
}

