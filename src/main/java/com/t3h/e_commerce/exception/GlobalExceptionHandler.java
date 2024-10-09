package com.t3h.e_commerce.exception;

import com.t3h.e_commerce.dto.ApiHandleResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomExceptionHandler.class)
    public ResponseEntity<ApiHandleResponse<CustomError>> handleProductException(CustomExceptionHandler ex, HttpServletRequest request){

        ApiHandleResponse<CustomError> apiHandleResponse = ApiHandleResponse.<CustomError>builder()
                .statusCode(ex.getStatus().value())
                .error(CustomError.builder()
                        .message(ex.getMessage())
                        .timestamp(new Date())
                        .path(request.getRequestURI())
                        .build())
                .build();

        return ResponseEntity.status(ex.getStatus()).body(apiHandleResponse);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiHandleResponse<CustomError>> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException exception,
                                                                           HttpServletRequest request){

        ApiHandleResponse<CustomError> apiHandleResponse = ApiHandleResponse.<CustomError>builder()
                .statusCode(HttpServletResponse.SC_METHOD_NOT_ALLOWED)
                .error(CustomError.builder()
                        .code("METHOD_NOT_ALLOWED")
                        .message("The " +exception.getMethod() + " method is not supported for route " + request.getRequestURI()
                                + ". Supported method: " + exception.getSupportedHttpMethods())
                        .details("The request method " + exception.getSupportedHttpMethods() + " is not supported. Please recheck!")
                        .timestamp(new Date())
                        .path(request.getRequestURI())
                        .build())
                .build();

        return new ResponseEntity<>(apiHandleResponse, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomError> handleGeneralException(Exception exception, HttpServletRequest request){

        CustomError response = CustomError.builder()
                .code("INTERNAL_SERVER_ERROR")
                .details("An unexpected error occurred. Please try again later!")
                .message(exception.getMessage())
                .timestamp(new Date())
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiHandleResponse<CustomError>> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception,
                                                                                                HttpServletRequest request){
        ApiHandleResponse<CustomError> apiHandleResponse = ApiHandleResponse.<CustomError>builder()
                .statusCode(HttpServletResponse.SC_BAD_REQUEST)
                .error(CustomError.builder().code("VALIDATION_ERROR")
                        .timestamp(new Date())
                        .message(Objects.requireNonNull(exception.getBindingResult().getFieldError()).getDefaultMessage())
                        .path(request.getRequestURI())
                        .details("Please recheck your information!")
                        .build())
                .build();
        return ResponseEntity.badRequest().body(apiHandleResponse);
    }

}
