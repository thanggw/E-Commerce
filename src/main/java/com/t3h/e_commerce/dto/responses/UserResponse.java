package com.t3h.e_commerce.dto.responses;

import com.t3h.e_commerce.dto.RoleDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.HashSet;
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
    String address;
    LocalDateTime createdDate;
    String createdBy;
    Set<RoleDTO> roles = new HashSet<>();
    LocalDateTime lastModifiedDate;
    String lastModifiedBy;
    Boolean deleted;
    String file;
    private String pathAvatar;
}
