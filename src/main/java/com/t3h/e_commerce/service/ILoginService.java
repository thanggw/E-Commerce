package com.t3h.e_commerce.service;

import com.t3h.e_commerce.dto.requests.AuthenticationRequest;
import com.t3h.e_commerce.dto.responses.AuthenticationResponse;

public interface ILoginService {
    AuthenticationResponse register(AuthenticationRequest request);
    public String processAfterLogin();
}
