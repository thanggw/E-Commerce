package com.t3h.e_commerce.exception;

import com.t3h.e_commerce.dto.ApiHandleResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        String requestURI = request.getRequestURI();

        // Nếu yêu cầu là một trang công khai, không cần chuyển hướng
        if (requestURI.startsWith("/home-guest") || requestURI.startsWith("/css") || requestURI.startsWith("/js")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Chuyển hướng người dùng chưa đăng nhập đến trang login
        response.sendRedirect("/guests/login");
    }
}

