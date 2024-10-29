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


@RestController
@RequestMapping("/guests")
public class UserController {



    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@RequestParam String username) {
        UserResponse userResponse = userService.getUserProfile(username);
        return ResponseEntity.ok(userResponse);
    }


}
