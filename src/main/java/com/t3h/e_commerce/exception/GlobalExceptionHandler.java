package com.t3h.e_commerce.exception;

import com.t3h.e_commerce.dto.ApiHandleResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.ui.Model;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public String handleAccessDeniedException(Model model) {
        model.addAttribute("errorCode", 403);
        return "guest/error"; // Trang error.html
    }

    @ExceptionHandler(AuthenticationException.class)
    public String handleAuthenticationException(Model model) {
        model.addAttribute("errorCode", 401);
        return "guest/error"; // Trang error.html
    }
}

