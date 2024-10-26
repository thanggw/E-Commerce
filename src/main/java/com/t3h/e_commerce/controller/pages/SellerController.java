package com.t3h.e_commerce.controller.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/guests")
public class SellerController {
    @GetMapping(value = "/seller")
    public String seller() {
        return "guest/Seller";
    }
}
