package com.t3h.e_commerce.controller.pages;

import com.t3h.e_commerce.service.ILoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/guests")
public class LoginController {
    @Autowired
    ILoginService loginService;
    @GetMapping(value="/login")
    public String loginPage() {
        return "guest/login";
    }
    @GetMapping(value = "process-after-login")
    public String processAfterLoginController(){
        return loginService.processAfterLogin();
    }
}
