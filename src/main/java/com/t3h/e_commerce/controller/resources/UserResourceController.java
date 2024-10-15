package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.ApiResponse;
import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Integer userId){
        return ApiResponse.<UserResponse>builder()
                .result(iUserService.getUserById(userId))
                .build();
    }

    @GetMapping("/all-users")
    public ResponsePage<UserResponse> getAllUsers(@RequestParam(name = "page", defaultValue = "0") int page,
                                                       @RequestParam(name = "size", defaultValue = "10") int size){
        return iUserService.getAllUsers(page, size);
    }

}
