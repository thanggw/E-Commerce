package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ApiResponse;
import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserResourceController {
    private final IUserService iUserService;

    @PostMapping("/registration")
    public ApiResponse<UserResponse> createUser(@RequestBody UseCreationRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(iUserService.createUser(request))
                .build();
    }
}
