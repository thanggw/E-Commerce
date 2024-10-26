package com.t3h.e_commerce.controller.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/guests")
public class UserController {

    @GetMapping("/login")
    public String loginPage() {
        return "guest/login";
    }

    @GetMapping("/homepage")
    public String homepage() {
        return "guest/homepage";
    }
    @GetMapping("/payment")
    public String paymentPage() {
        return "guest/payment";
    }
    @GetMapping("/viewdetail")
    public String viewdetailPage() {
        return "guest/viewdetail";
    }
    @GetMapping("cart")
    public String viewCart(){
        return "guest/cart";
    }

}
