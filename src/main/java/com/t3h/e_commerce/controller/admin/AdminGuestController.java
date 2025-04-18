package com.t3h.e_commerce.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("adminScreen")
public class AdminGuestController {
    @GetMapping(value = "/activate")
    public String activate() {
        return "admin/activate";
    }

    @GetMapping(value = "/user_detail")
    public String userDetail() {
        return "admin/user_detail";
    }

    @GetMapping(value = "/adminProfile")
    public String adminProfile() {
        return "admin/adminProfile";
    }

    @GetMapping(value = "/productManagement")
    public String productManagement() {
        return "admin/productManagement";
    }

    @GetMapping(value = "/all_order")
    public String allOrder() {
        return "admin/order_management";
    }

    @GetMapping(value="/voucher")
    public String voucher() {
        return "admin/voucher";
    }
}
