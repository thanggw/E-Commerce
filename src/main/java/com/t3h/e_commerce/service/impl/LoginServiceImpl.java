package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.dto.requests.AuthenticationRequest;
import com.t3h.e_commerce.dto.responses.AuthenticationResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.RoleEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.entity.WishlistEntity;
import com.t3h.e_commerce.mapper.UserMapper;
import com.t3h.e_commerce.repository.CartRepository;
import com.t3h.e_commerce.repository.RoleRepository;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.security.SecurityUtils;
import com.t3h.e_commerce.service.ILoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Security;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LoginServiceImpl implements ILoginService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public AuthenticationResponse register(AuthenticationRequest request) {
        // Kiểm tra username và email đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        // Tìm role USER
        RoleEntity userRole = roleRepository.findRoleEntityByCode("USER")
                .orElseThrow(() -> new IllegalStateException("Role USER not found!"));

        // Mapping request thành UserEntity
        UserEntity user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Tạo giỏ hàng mặc định
        CartEntity cart = new CartEntity();
        cart.setTotalQuantity(0);
        cart.setTotalPrice(BigDecimal.ZERO);
        user.setCart(cart);

        // Tạo danh sách yêu thích mặc định
        WishlistEntity wishlist = new WishlistEntity();
        wishlist.setUser(user); // Gắn User vào Wishlist
        wishlist.setWishlistItems(new ArrayList<>());
        user.setWishlist(wishlist); // Gắn Wishlist vào User

        // Gán role USER cho user mới
        user.setRoles(Set.of(userRole));

        // Lưu vào database
        UserEntity savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }


    @Override
    public String processAfterLogin() {
       Set<String> roleCode = SecurityUtils.getRolesCurrentUser();
       if (roleCode.contains("ROLE_ADMIN")){
           return "redirect:/guests/home-guest"; // redirect sang trang admin
       }
        return "redirect:/guests/home-guest"; // redirect sang trang user
    }
}
