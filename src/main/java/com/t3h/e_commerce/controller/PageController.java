package com.t3h.e_commerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // Xử lý request đến "/chat" và trả về file chat.html
    @GetMapping("/chat")
    public String chatPage() {
        return "chat"; // Trả về tên file HTML (không cần đuôi .html)
    }
}
