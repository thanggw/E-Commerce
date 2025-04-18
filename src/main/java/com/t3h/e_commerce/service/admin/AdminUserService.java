package com.t3h.e_commerce.service.admin;

import com.t3h.e_commerce.dto.RoleDTO;
import com.t3h.e_commerce.dto.adminResponse.UserBasicInfoDTO;
import com.t3h.e_commerce.dto.adminResponse.UserDetailInfoDTO;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.enums.UserStatus;
import com.t3h.e_commerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Vô hiệu hóa tài khoản (chuyển trạng thái sang INACTIVE)
     */
    public void deactivateUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
    }

    /**
     * Tạm khóa tài khoản (chuyển trạng thái sang LOCKED)
     */
    public void lockUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.LOCKED);
        userRepository.save(user);
    }

    /**
     * Kích hoạt lại tài khoản (chuyển trạng thái sang ACTIVE)
     */
    public void activateUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    // Lấy danh sách người dùng với thông tin cơ bản
    public List<UserBasicInfoDTO> getAllUsersBasicInfo() {
        return userRepository.findAll().stream()
                .map(user -> new UserBasicInfoDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getStatus()
                ))
                .collect(Collectors.toList());
    }

    // Lấy thông tin chi tiết của một người dùng
    public UserDetailInfoDTO getUserDetailInfo(Integer userId) {
        return userRepository.findById(userId)
                .map(user -> new UserDetailInfoDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getPathAvatar(),
                        user.getBankName(),
                        user.getBankAccount(),
                        user.getRoles().stream()
                                .map(role -> new RoleDTO(role.getCode(), role.getDescription()))
                                .collect(Collectors.toSet())
                ))
                .orElse(null);
    }

}
