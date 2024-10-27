package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.AuthenticationRequest;
import com.t3h.e_commerce.dto.responses.AuthenticationResponse;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.service.IAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        validateLoginRequest(request);

        UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> CustomExceptionHandler.notFoundException("User not found"));

        boolean isAuthenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!isAuthenticated){
            throw CustomExceptionHandler.unauthorizedException("User not authenticated");
        }

        return AuthenticationResponse.builder()
                .isAuthenticated(true)
                .build();
    }

    private void validateLoginRequest(AuthenticationRequest request) {

        if (request.getUsername() == null) {
            throw CustomExceptionHandler.badRequestException("Username is required");
        }

        if (request.getPassword() == null) {
            throw CustomExceptionHandler.badRequestException("Password is required");
        }
    }
}
