package com.t3h.e_commerce.dto.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserResponse {
    Integer id;
    String username;
    String email;
    String firstName;
    String lastName;
    String phone;
    Set<String> roles;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime lastModifiedDate;
    String lastModifiedBy;
    Boolean deleted;
}
