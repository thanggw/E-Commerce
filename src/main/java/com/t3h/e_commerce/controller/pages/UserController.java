package com.t3h.e_commerce.controller.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


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
        return "guest/protofile";
    }
    @GetMapping("/news")
    public String news(){
        return "guest/news";
    }
    @GetMapping("/newdetail")
    public String newdetail(){
        return "guest/newdetail";
    }
    @GetMapping("/location")
    public String location(){
        return "guest/location";
    }
    @GetMapping("/contact")
    public String contact(){
        return "guest/contact";
    }
    @GetMapping("/sellerchannel")
    public String sellerchannel(){
        return "admin/sellerchannel";
    }
    @GetMapping("/faq")
    public String faq(){
        return "guest/faq";
    }
}
