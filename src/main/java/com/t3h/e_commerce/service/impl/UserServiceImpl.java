package com.t3h.e_commerce.service.impl;

import com.t3h.e_commerce.configuration.ApplicationConfig;
import com.t3h.e_commerce.dto.Response;
import com.t3h.e_commerce.dto.responses.UserResponse;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.mapper.UserMapper2;
import com.t3h.e_commerce.repository.UserRepository;
import com.t3h.e_commerce.security.SecurityUtils;
import com.t3h.e_commerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserRepository userRepository;


    @Autowired
    private UserMapper2 userMapper;

    @Autowired
    private ApplicationConfig applicationConfig;

    @Value("${storage.avatar.relative.path}")
    private String avatarRelativePath;


    @Override
    public UserResponse getUserByUsername(String username) {
        Optional<UserEntity> userEntityOptional = userRepository.findByUsername(username);

        if (userEntityOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        UserEntity userEntity = userEntityOptional.get();
        UserResponse UserResponse = userMapper.toDTO(userEntity);

        // Nếu user chưa có avatar lưu trong db, sẽ lấy avatar mặc định
        if (StringUtils.isEmpty(UserResponse.getPathAvatar())) {
            UserResponse.setPathAvatar(avatarRelativePath + FileServiceImpl.DEFAULT_FILE_NAME);
        }

        return UserResponse;
    }

    @Override
    public Response<UserResponse> getProfileUser() {
        String userCurrentUser = SecurityUtils.getCurrentUserName();

        if (StringUtils.isEmpty(userCurrentUser)) {
            // query và chuyển sang DTO
            Response<UserResponse> response = new Response<>();
            response.setData(null);
            response.setCode(HttpStatus.UNAUTHORIZED.value());
            response.setMessage("Unauthorized");
            return response;
        }
        // query và chuyển sang DTO
        UserResponse UserResponse = getUserByUsername(userCurrentUser);
        Response<UserResponse> response = new Response<>();
        response.setData(UserResponse);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        return response;
    }

    @Override
    public UserResponse updateProfileUser(UserResponse UserResponse)  {
        UserEntity userEntity = userRepository.findById(UserResponse.getId().intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        handleAvatar(UserResponse, userEntity);

        userEntity.setFirstName(UserResponse.getFirstName());
        userEntity.setLastName(UserResponse.getLastName());
        userEntity.setEmail(UserResponse.getEmail());
        userEntity.setLastModifiedDate(LocalDateTime.now());
        userEntity.setLastModifiedBy(UserResponse.getUsername());
        userEntity.setAddress(UserResponse.getAddress());
        userEntity.setPhone(UserResponse.getPhone());

        userRepository.save(userEntity);

        return UserResponse;
    }

    private void handleAvatar(UserResponse UserResponse, UserEntity userEntity) {
        if (StringUtils.hasText(UserResponse.getFile())) {
            // Chuỗi base64 có định dạng: data:image/jpeg;base64,...
            String base64String = UserResponse.getFile();
            String[] parts = base64String.split(",");

            // Phần MIME type, ví dụ: data:image/jpeg;base64
            String mimeType = parts[0];

            // Phần dữ liệu thực sự Base64
            String base64Data = parts[1];

            // Giải mã Base64
            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

            // Xác định định dạng file từ MIME type (ví dụ: jpg, png)
            String fileExtension = "";
            if (mimeType.contains("image/jpeg")) {
                fileExtension = "jpg";
            } else if (mimeType.contains("image/png")) {
                fileExtension = "png";
            }
            // Lưu file vào folder của hệ thống, nhận về file name để thực hiện tạo ra đường dẫn tương đối
            String fileName = saveFileToFolder(UserResponse, fileExtension, decodedBytes);
            String pathAvatarSaveDb = avatarRelativePath + fileName;
            // Set đường dẫn file avatar vào UserEntity
            userEntity.setPathAvatar(pathAvatarSaveDb);
        }
    }

    private String saveFileToFolder(UserResponse UserResponse, String fileExtension, byte[] decodedBytes) {
        // Tạo đường dẫn đầy đủ cho file ảnh (rootFolder + tên file)
        String rootFolder = applicationConfig.getRootFolderAvatar();
        String fileName = "avatar_" + UserResponse.getUsername() + "_" + UserResponse.getId() + "." + fileExtension;
        String finalPath = rootFolder + fileName;

        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        File folder = new File(rootFolder);
        if (!folder.exists()) {
            folder.mkdirs(); // Tạo tất cả các thư mục cần thiết nếu chúng chưa tồn tại
        }

        // Lưu file ảnh vào hệ thống
        try (FileOutputStream fos = new FileOutputStream(new File(finalPath))) {
            fos.write(decodedBytes);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return fileName;
    }


}


