package com.t3h.e_commerce.configuration;

import com.t3h.e_commerce.exception.CustomAccessDeniedHandler;
import com.t3h.e_commerce.exception.CustomAuthenticationEntryPoint;
import com.t3h.e_commerce.service.impl.CustomOAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebSecurity
@Configuration
@EnableGlobalAuthentication
public class WebSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:8082") // Đổi thành domain của bạn
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true)
                        .exposedHeaders("X-CSRF-TOKEN"); // Cho phép client đọc CSRF token
            }
        };
    }
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers(
                        "/api/**",
                        "/ws/**"
                )
        );

        http.authorizeHttpRequests((request) -> request
                        .requestMatchers("/home-guest/**", "/").permitAll()
                        .requestMatchers("/css/**", "/image/**", "/js/**").permitAll()
                        .requestMatchers("/login/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll() // Cho phép OAuth2 URL
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/orders/order", "/carts/add").authenticated()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .formLogin((form) -> form
                        .loginPage("/guests/login")
                        .loginProcessingUrl("/perform_login")
                        .defaultSuccessUrl("/guests/process-after-login", true)
                        .failureUrl("/guests/login?error=true")
                        .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/guests/login")
                        .defaultSuccessUrl("/guests/process-after-login", true)
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // Gán custom service vào đây
                        )
                )
                .logout((logout) -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("/guests/login?logout=true")
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                )
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        http.exceptionHandling(exception -> {
            exception.accessDeniedHandler(new CustomAccessDeniedHandler());
            exception.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
        });

        return http.build();
    }





    public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Password account admin: " + encoder.encode("admin"));
        System.out.println("Password account user: " + encoder.encode("admin"));
    }
}