package com.t3h.e_commerce.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class SecurityUtils {
    public static final String PREFIX_ROLE = "ROLE_";
    public static enum Role {
        ADMIN(1),
        USER(2);

        private final int roleId;

        Role(int roleId) {
            this.roleId = roleId;
        }

        public int getRoleId() {
            return roleId;
        }
    }
    public static Set<String> getRolesCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Set<String> roleCode = new HashSet<>();
        if (authentication != null) {
            Collection<? extends GrantedAuthority> roles = authentication.getAuthorities();
            roleCode = roles.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
        }
        return roleCode;
    }
}
