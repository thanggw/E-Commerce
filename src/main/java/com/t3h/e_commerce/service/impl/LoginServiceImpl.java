package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.security.SecurityUtils;
import com.t3h.e_commerce.service.ILoginService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LoginServiceImpl implements ILoginService {
    @Override
    public String processAfterLogin() {
       Set<String> roleCode = SecurityUtils.getRolesCurrentUser();
       if (roleCode.contains("ROLE_ADMIN")){
           return "redirect:/guest/HomePage";
       }
        return "redirect:/guest/profile";
    }
}
