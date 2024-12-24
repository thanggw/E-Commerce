/*package com.t3h.e_commerce.mapper;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        // Lấy tên người dùng hiện tại từ SecurityContext hoặc một nơi khác
        // Ví dụ: return Optional.of(SecurityContextHolder.getContext().getAuthentication().getName());
        return Optional.of(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}*/
