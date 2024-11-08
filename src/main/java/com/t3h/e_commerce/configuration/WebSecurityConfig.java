package com.t3h.e_commerce.configuration;

import com.t3h.e_commerce.exception.CustomAccessDeniedHandler;
import com.t3h.e_commerce.exception.CustomAuthenticationEntryPoint;
import com.t3h.e_commerce.security.SecurityUtils;
import com.t3h.e_commerce.utils.Endpoints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
public class WebSecurityConfig {
    @Autowired
    private UserDetailsService userDetailsService;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests((request) -> request
                        .requestMatchers("/guests/**").hasAnyRole(SecurityUtils.Role.USER.name(), SecurityUtils.Role.ADMIN.name())
                        .requestMatchers("/home-guest", "/").permitAll()
                        .requestMatchers("/seller").permitAll()
                        .requestMatchers("/css/**").permitAll()
                        .requestMatchers("/image/**").permitAll()
                        .requestMatchers("/js/**").permitAll()
                        .requestMatchers("/login/**").permitAll()
                        .requestMatchers("/guests/login").permitAll()
                        .requestMatchers("/seller_css/**").permitAll()
                        .requestMatchers("/seller_js/**").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers(Endpoints.Admin_Endpoints).hasRole("ADMIN")
                        .requestMatchers("/orders/order").permitAll()
                        .requestMatchers("/carts/add").permitAll()
                        .anyRequest().authenticated())
                .formLogin((form) -> form
                        .loginPage("/guests/login") // config truy cap url login
                        .loginProcessingUrl("/perform_login") // config url gui username, pass tu form login len server
                        .defaultSuccessUrl("/guests/process-after-login", true) // sau khi login thành công sẽ truy cập vào url process-after-login để điều hướng phân quyền
                        .failureUrl("/guests/login?error=true") //  url neu login fals
                        .permitAll()
                )
                .logout((logout) -> logout.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .permitAll()
                );


//        httpSecurity.exceptionHandling(exception -> {
//            exception.accessDeniedHandler(new CustomAccessDeniedHandler());
//            exception.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
//        });

        return http.build();
    }

    public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Password account admin: " + encoder.encode("admin"));
        System.out.println("Password account user: " + encoder.encode("admin"));
    }
}
