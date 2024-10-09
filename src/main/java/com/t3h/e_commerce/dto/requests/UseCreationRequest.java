package com.t3h.e_commerce.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UseCreationRequest {
    String username;
    String password;
    String email;
    String firstName;
    String lastName;
    String phone;
    String address;
}
