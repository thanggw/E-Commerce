package com.t3h.e_commerce.dto.requests;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UserRequestFilter {
    private String username;
    private String email;
    private String phone;
    private String address;
    private String fullName;
}
