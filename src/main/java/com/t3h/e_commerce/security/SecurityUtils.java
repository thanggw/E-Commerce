package com.t3h.e_commerce.security;

import com.t3h.e_commerce.utils.Constants;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class SecurityUtils {

    public static String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !Constants.ANONYMOUS_USER.equals(authentication.getName())) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                return ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            } else if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User) {
                OAuth2User oAuth2User = (OAuth2User) principal;
                // Tùy thuộc vào provider, ở Google thì thường là "email"
                return oAuth2User.getAttribute("email");
            } else {
                // fallback
                return authentication.getName();
            }
        }
        return "";
    }


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
