package com.t3h.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
      private String code;
      private String description;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


}
