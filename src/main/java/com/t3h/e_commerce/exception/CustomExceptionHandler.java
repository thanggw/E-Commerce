package com.t3h.e_commerce.exception;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Setter
@Getter
@Builder
public class CustomExceptionHandler extends RuntimeException{

    HttpStatus status;
    CustomError error;

    public static CustomExceptionHandler notFoundException(String message){

        return CustomExceptionHandler.builder()
                .error(CustomError.builder()
                        .code("NOT_FOUND")
                        .message(message)
                        .details("The information that you provided for us could not be found. Please recheck your information!")
                        .build())
                .status(HttpStatus.NOT_FOUND).build();

    }

    public static CustomExceptionHandler badRequestException(String message){
        return CustomExceptionHandler.builder()
                .error(CustomError.builder()
                        .code("BAD_REQUEST")
                        .message(message)
                        .details("The information that you provided for us could be bad requested. Please recheck your information!")
                        .build())
                .status(HttpStatus.BAD_REQUEST).build();
    }

    public static CustomExceptionHandler unauthorizedException(String message){
        return CustomExceptionHandler.builder()
                .error(CustomError.builder()
                        .code("UNAUTHORIZED")
                        .message(message)
                        .build())
                .status(HttpStatus.UNAUTHORIZED).build();
    }



}
