package com.t3h.e_commerce.controller.resources;

import com.t3h.e_commerce.dto.Response;
import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.requests.UserRequestFilter;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserResourceController {
    private final IUserService iUserService;



    @GetMapping("/profile")
    public ResponseEntity<Response<UserResponse>> profile(){
             Response<UserResponse> response =iUserService.getProfileUser();
             return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUse(@RequestBody UserResponse user){
            try {
                  UserResponse userResponse =iUserService.updateProfileUser(user);
                  return ResponseEntity.ok(userResponse);
            }catch (Exception e){
                  return ResponseEntity.badRequest().body("Error: "+e.getMessage());
            }
    }

}
