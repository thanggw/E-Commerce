package com.t3h.e_commerce.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiHandleResponse<T>{
    boolean success = false;
    int statusCode;
    T error;
}
