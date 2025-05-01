package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.entity.*;
import com.t3h.e_commerce.exception.CustomOAuth2User;
import com.t3h.e_commerce.repository.RoleRepository;
import com.t3h.e_commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "google" hoặc "facebook"
        String email = null;
        String name = null;

        // Xử lý tùy theo provider
        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        } else if ("facebook".equals(registrationId)) {
            email = (String) attributes.get("email"); // phải đảm bảo scope có 'email'
            name = (String) attributes.get("name");   // Facebook trả về "name" đầy đủ
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);

        UserEntity userEntity;
        if (userOpt.isPresent()) {
            userEntity = userOpt.get();
        } else {
            userEntity = new UserEntity();
            userEntity.setUsername(email.split("@")[0]);
            userEntity.setEmail(email);
            userEntity.setFirstName(name);
            userEntity.setLastName("");
            userEntity.setPhone("");
            userEntity.setAddress("");

            CartEntity cart = new CartEntity();
            cart.setTotalQuantity(0);
            cart.setTotalPrice(BigDecimal.ZERO);
            userEntity.setCart(cart);

            WishlistEntity wishlist = new WishlistEntity();
            wishlist.setWishlistItems(new ArrayList<>());
            wishlist.setUser(userEntity);
            userEntity.setWishlist(wishlist);

            RoleEntity roleUser = roleRepository.findRoleEntityByCode("USER")
                    .orElseThrow(() -> new IllegalStateException("Role USER not found!"));
            userEntity.setRoles(Set.of(roleUser));

            userRepository.save(userEntity);
        }

        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        userEntity.getRoles().forEach(role ->
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()))
        );

        return new CustomOAuth2User(userEntity, attributes, authorities);
    }


}


