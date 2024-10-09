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
    ApplicationRunner applicationRunner(){
        return args -> {
            log.info("Initializing Application.....");
            if(userRepository.findUserByUsername("admin").isEmpty()){

                RoleEntity adminRole = new RoleEntity();
                adminRole.setCode(DefaultRoles.ADMIN_ROLE);
                adminRole.setDescription("Admin role");


                RoleEntity userRole = new RoleEntity();
                userRole.setCode(DefaultRoles.USER_ROLE);
                userRole.setDescription("User role");

                UserEntity admin = new UserEntity();
                admin.setUsername(ADMIN_USERNAME);
                admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                admin.setEmail("admin@gmail.com");

                admin.setRoles(Set.of(adminRole));

                roleRepository.saveAll(List.of(adminRole, userRole));
                userRepository.save(admin);
            }
        };
    };
}
