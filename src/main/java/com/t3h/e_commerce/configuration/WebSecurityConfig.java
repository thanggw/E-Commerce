package com.t3h.e_commerce.configuration;

import com.t3h.e_commerce.exception.CustomAccessDeniedHandler;
import com.t3h.e_commerce.exception.CustomAuthenticationEntryPoint;
import com.t3h.e_commerce.security.SecurityUtils;
import com.t3h.e_commerce.utils.Endpoints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableWebSecurity
@Configuration
@EnableGlobalAuthentication
public class WebSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);

        http.authorizeHttpRequests((request) -> request
                        .requestMatchers("/home-guest/**", "/").permitAll() // Cho phép truy cập homepage
                        .requestMatchers("/css/**", "/image/**", "/js/**").permitAll() // Static resources
                        .requestMatchers("/login/**").permitAll() // Trang login
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/orders/order", "/carts/add").authenticated() // Bắt buộc phải login
                        .requestMatchers(Endpoints.Admin_Endpoints).hasRole("ADMIN") // Chỉ admin mới truy cập
                        .anyRequest().authenticated()) // Mọi request khác phải login
                .formLogin((form) -> form
                        .loginPage("/guests/login") // URL của trang đăng nhập
                        .loginProcessingUrl("/perform_login") // Xử lý đăng nhập
                        .defaultSuccessUrl("/guests/process-after-login", true) // Sau khi đăng nhập thành công
                        .failureUrl("/guests/login?error=true") // URL khi đăng nhập thất bại
                        .permitAll()
                )
                .logout((logout) -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("/guests/login?logout=true") // Sau khi đăng xuất thành công
                        .deleteCookies("JSESSIONID") // Xóa cookie session
                        .permitAll()
                );

        // Bỏ xử lý lỗi cho URL được permitAll
        http.exceptionHandling(exception -> {
            exception.accessDeniedHandler(new CustomAccessDeniedHandler());
            exception.authenticationEntryPoint(new CustomAuthenticationEntryPoint()); // Định nghĩa rõ URL chuyển hướng
        });

        return http.build();
    }


    public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Password account admin: " + encoder.encode("admin"));
        System.out.println("Password account user: " + encoder.encode("admin"));
    }
}