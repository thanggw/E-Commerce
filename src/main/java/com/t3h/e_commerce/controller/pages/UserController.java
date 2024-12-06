package com.t3h.e_commerce.controller.pages;

import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.service.ILoginService;
import com.t3h.e_commerce.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Controller
@RequestMapping("/guests")
public class UserController {
    @GetMapping("/profile")
    public String profile(){
        return "guest/profile";
    }

    @GetMapping("/cart")
    public String cart(){
        return "guest/cart";
    }

    @GetMapping("/allproducts")
    public String allProducts(){
        return "guest/allproducts";
    }

    @GetMapping("/checkout")
    public String checkout(){
        return "guest/checkout";
    }
    @GetMapping("/notification")
    public String notification(){
        return "guest/notification";
    }
    @GetMapping("/voucher")
    public String voucher(){
        return "guest/voucher";
    }
    @GetMapping("/order")
    public String order(){
        return "guest/orderInterface";
    }
    @GetMapping("/detail")
    public String detail(){
        return "guest/viewdetail";
    }
    @GetMapping("/wishlist")
    public String wishlist(){
        return "guest/wishlist";
    }
    @GetMapping("/seller")
    public String seller(){
        return "guest/seller";
    }
    @GetMapping("/aboutus")
    public String aboutus(){
        return "guest/AboutUs";
    }
}
