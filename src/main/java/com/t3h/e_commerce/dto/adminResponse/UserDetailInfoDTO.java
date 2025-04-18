package com.t3h.e_commerce.dto.adminResponse;

import com.t3h.e_commerce.dto.RoleDTO;
import com.t3h.e_commerce.entity.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailInfoDTO {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String firstName;
    private String lastName;
    private String pathAvatar;
    private String bankName;
    private String bankAccount;
    private Set<RoleDTO> roles;


}
