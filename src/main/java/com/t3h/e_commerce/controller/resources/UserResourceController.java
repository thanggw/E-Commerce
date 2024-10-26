package com.t3h.e_commerce.controller.resources;

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
@RequestMapping("/users")
public class UserResourceController {
    private final IUserService iUserService;

    @PostMapping("/registration")
    public ResponseEntity<UserResponse> createUser(@RequestBody UseCreationRequest request){
        UserResponse response = iUserService.createUser(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer userId){
        return ResponseEntity.ok(iUserService.getUserById(userId));
    }

    @GetMapping("/all-users")
    public ResponsePage<UserResponse> getAllUsers(
            @RequestParam(name = "username", required = false) String username,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "address", required = false) String address,
            @RequestParam(name = "phone", required = false) String phone,
            @RequestParam(name = "fullName", required = false) String fullName,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size){

        UserRequestFilter filter = new UserRequestFilter();
                filter.setUsername(username);
                filter.setEmail(email);
                filter.setAddress(address);
                filter.setPhone(phone);
                filter.setFullName(fullName);

        return iUserService.getAllUsers(filter, page, size);
    }

}
