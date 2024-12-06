package com.t3h.e_commerce.configuration;

import com.t3h.e_commerce.constant.DefaultRoles;
import com.t3h.e_commerce.entity.RoleEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.repository.RoleRepository;
import com.t3h.e_commerce.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Slf4j
public class ApplicationInitConfig {

    @Value("${admin.username}")
    String ADMIN_USERNAME;

    @Value("${admin.password}")
    String ADMIN_PASSWORD;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public ApplicationInitConfig(PasswordEncoder passwordEncoder,
                                 UserRepository userRepository,
                                 RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            log.info("Initializing Application...");

            if (userRepository.findByUsername("admin").isEmpty()) {
                log.info("Checking and initializing default roles...");

                RoleEntity adminRole = getOrCreateRole(DefaultRoles.ADMIN_ROLE, "Admin role");
                RoleEntity userRole = getOrCreateRole(DefaultRoles.USER_ROLE, "User role");

                log.info("Default roles initialized.");

                // Tạo admin user
                UserEntity admin = new UserEntity();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@gmail.com");
                admin.setRoles(Set.of(adminRole, userRole));

                userRepository.save(admin);
                log.info("Admin user '{}' created successfully.", "admin");
            } else {
                log.info("Admin user '{}' already exists. Skipping initialization.", "admin");
            }
        };
    }

    private RoleEntity getOrCreateRole(String roleCode, String roleDescription) {
        return roleRepository.findRoleEntityByCode(roleCode)
                .orElseGet(() -> roleRepository.save(new RoleEntity(roleCode, roleDescription)));
    }



}
