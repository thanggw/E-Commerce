package com.t3h.e_commerce.dto.adminResponse;

import com.t3h.e_commerce.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBasicInfoDTO {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String address;
    private UserStatus status;
}
