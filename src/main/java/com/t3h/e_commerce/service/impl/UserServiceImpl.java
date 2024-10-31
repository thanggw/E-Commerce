package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.constant.DefaultRoles;
import com.t3h.e_commerce.dto.Response;
import com.t3h.e_commerce.dto.ResponsePage;
import com.t3h.e_commerce.dto.requests.UseCreationRequest;
import com.t3h.e_commerce.dto.requests.UserRequestFilter;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.CartEntity;
import com.t3h.e_commerce.entity.RoleEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.exception.CustomExceptionHandler;
import com.t3h.e_commerce.mapper.UserMapper;
import com.t3h.e_commerce.mapper.UserMapper2;
import com.t3h.e_commerce.repository.CartRepository;
import com.t3h.e_commerce.repository.RoleRepository;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.security.SecurityUtils;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final CartRepository cartRepository;
    private final RoleRepository roleRepository;

    @Autowired
    private UserMapper2 userMapper;

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

    @Override
    public UserResponse getUserByUsername(String username) {
        UserEntity userEntity = userRepository.findByUsername(username);
        UserResponse userDTO = userMapper.toDTO(userEntity);
        // Nếu user chưa có avatar lưu trong db. Sẽ lấy avatar mặc định
        if (StringUtils.isEmpty(userDTO.getPathAvatar())){
            userDTO.setPathAvatar(avatarRelativePath + FileServiceImpl.DEFAULT_FILE_NAME);
        }
        return userDTO;
    }
    @Override
    public Response<UserResponse> getProfileUser() {
        String userCurrentUser = SecurityUtils.getCurrentUserName();
        if (StringUtils.isEmpty(userCurrentUser)){
            // query và chuyển sang DTO
            Response<UserResponse> response = new Response<>();
            response.setData(null);
            response.setCode(HttpStatus.UNAUTHORIZED.value());
            response.setMessage("Unauthorized");
            return response;
        }

        // query và chuyển sang DTO
        UserResponse userDTO= getUserByUsername(userCurrentUser);
        Response<UserResponse> response = new Response<>();
        response.setData(userDTO);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        return response;
    }

    @Override
    public UserResponse updateProfileUser(UserResponse userResponse) {
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
    public UserResponse getUserProfile(String username) {
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Convert UserEntity to UserResponse DTO
        return UserResponse.builder()
                .id(userEntity.getId())
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .phone(userEntity.getPhone())
                .roles(userEntity.getRoles().stream()
                        .map(RoleEntity::getCode)
                        .collect(Collectors.toSet()))
                .createdDate(userEntity.getCreatedDate())
                .createdBy(userEntity.getCreatedBy())
                .lastModifiedDate(userEntity.getLastModifiedDate())
                .lastModifiedBy(userEntity.getLastModifiedBy())
                .deleted(userEntity.getDeleted())
                .build();
    }
}
