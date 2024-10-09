package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.responses.UserResponse;

public interface IUserService {

    UserResponse createUser(UseCreationRequest request);
}
