package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.Response;
import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.requests.UserRequestFilter;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.UserEntity;

import java.util.List;

public interface IUserService {

    UserResponse createUser(UseCreationRequest request);

    UserResponse getUserById(Integer userId);

    UserEntity getUserLoggedIn();

    Response<UserResponse> getProfileUser();
    UserResponse updateProfileUser(UserResponse userResponse);
    UserResponse getUserByUsername(String username);

    ResponsePage<UserResponse> getAllUsers(UserRequestFilter filter, int page, int size);
}
