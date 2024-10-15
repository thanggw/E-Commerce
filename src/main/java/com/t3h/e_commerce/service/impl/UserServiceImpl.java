package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.constant.DefaultRoles;
import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.requests.UserRequestFilter;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.RoleEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.mapper.UserMapper;
import com.t3h.e_commerce.repository.CartRepository;
import com.t3h.e_commerce.repository.RoleRepository;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final CartRepository cartRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse createUser(UseCreationRequest request) {

        UserEntity user = validateRegisterRequest(request);

        Set<RoleEntity> authorities = new HashSet<>();

        authorities.add(roleRepository.findRoleEntityByCode(DefaultRoles.USER_ROLE).orElseThrow(() ->
                CustomExceptionHandler.notFoundException("Default role not found")));

        user.setRoles(authorities);
        user = userRepository.save(user);

        return UserMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserById(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> CustomExceptionHandler.notFoundException("User not found"));
        return UserMapper.toUserResponse(user);
    }

    @Override
    public ResponsePage<UserResponse> getAllUsers(UserRequestFilter filter, int page, int size) {

        Sort nameSorted = Sort.by("username").ascending();
        Pageable pageable = PageRequest.of(page, size, nameSorted);

        Page<UserEntity> userEntityPage = userRepository.findAllUserByConditions(filter, pageable);

        List<UserResponse> userResponses = userEntityPage.getContent().stream()
                .map(UserMapper::toUserResponse)
                .toList();

        ResponsePage<UserResponse> responsePage = new ResponsePage<>();
        responsePage.setContent(userResponses);
        responsePage.setPageSize(userEntityPage.getSize());
        responsePage.setTotalElements(userEntityPage.getTotalElements());
        responsePage.setTotalPages(userEntityPage.getTotalPages());
        responsePage.setCurrentPage(pageable.getPageNumber());

        return responsePage;
    }

    @Override
    public UserEntity getUserLoggedIn() {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(principal instanceof UserDetails){
            String userEmail = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(userEmail).orElseThrow(() ->
                    CustomExceptionHandler.notFoundException("User not found"));

        }
        return null;
    }

    private UserEntity validateRegisterRequest(UseCreationRequest request){

        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        boolean usernameExist = userRepository.findByUsername(username).isPresent();
        boolean emailExist = userRepository.findByEmail(email).isPresent();

        if (username == null) {
            throw CustomExceptionHandler.badRequestException("Username is required");
        }

        if (email == null) {
            throw CustomExceptionHandler.badRequestException("Email is required");
        }

        if (password == null) {
            throw CustomExceptionHandler.badRequestException("Password is required");
        }

        if (emailExist) {
            throw CustomExceptionHandler.badRequestException("Email already in use");
        }

        if (usernameExist){
            throw CustomExceptionHandler.badRequestException("Username already in use");
        }

        UserEntity user = modelMapper.map(request, UserEntity.class);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedDate(LocalDateTime.now());
        user.setLastModifiedDate(LocalDateTime.now());

        user = userRepository.save(user);

        CartEntity cart = new CartEntity();
        cart.setUser(user);

         cartRepository.save(cart);

        user.setCart(cart);

        return user;
    }
}
