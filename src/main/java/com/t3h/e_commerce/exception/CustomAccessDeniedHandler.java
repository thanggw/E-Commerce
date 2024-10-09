package com.t3h.e_commerce.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.t3h.e_commerce.dto.ApiHandleResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        ApiHandleResponse<CustomError> apiHandleResponse  = new ApiHandleResponse<>();
        apiHandleResponse.setStatusCode(HttpServletResponse.SC_FORBIDDEN);
        CustomError customError = CustomError.builder()
                .code("RESOURCE_ACCESS_DENIED")
                .path(request.getRequestURI())
                .timestamp(new Date())
                .message(accessDeniedException.getMessage())
                .details("Access is denied due to only ADMIN or MANAGER permission access those endpoints. Please recheck your information!")
                .build();

        apiHandleResponse.setError(customError);

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(apiHandleResponse));


    }
}
