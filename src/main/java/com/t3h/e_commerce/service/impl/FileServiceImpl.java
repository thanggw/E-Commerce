package com.t3h.e_commerce.service.impl;


import com.t3h.e_commerce.configuration.ApplicationConfig;
import com.t3h.e_commerce.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileServiceImpl implements FileService {

    @Value("${storage.root.folder.avatar}")
    private String ROOT_UPLOAD_DIR_AVATAR;
    public static final String DEFAULT_FILE_NAME="default.png";

    @Value("${storage.root.folder.product}")
    public String ROOT_IMAGES_PRODUCT;

    @Autowired
    private ApplicationConfig applicationConfig;

    // Phương thức tải file avatar dưới dạng Resource
    public Resource loadAvatarAsResource(String filename) {
        // filename = "avatar_admin_1.jpg"
        // ROOT_UPLOAD_DIR_AVATAR = "D:\T3h\T3H - UTC_Insurance_claim\insurance-claims\storage\avatar\"
        String fullPath = ROOT_UPLOAD_DIR_AVATAR + filename;
        // fullPath = "D:\T3h\T3H - UTC_Insurance_claim\insurance-claims\storage\avatar\avatar_admin_1.jpg"
        File file = null;
        try {
            file = new File(fullPath);
            if (file.exists()) {
                return new FileSystemResource(file);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        fullPath = ROOT_UPLOAD_DIR_AVATAR + DEFAULT_FILE_NAME;
        // fullPath = "D:\T3h\T3H - UTC_Insurance_claim\insurance-claims\storage\avatar\default.png"
        file = new File(fullPath);
        return new FileSystemResource(file);
    }

    @Override
    public Resource loadImageProduct(String fileName) {
        try {
            Path file = Paths.get(applicationConfig.getRootFolderProduct()).resolve(fileName);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileNotFoundException("File không tồn tại hoặc không thể đọc: " + fileName);
            }
        } catch (MalformedURLException | FileNotFoundException e) {
            e.printStackTrace();
            // Trả về ảnh mặc định nếu không tìm thấy
            Path defaultFile = Paths.get(applicationConfig.getRootFolderProduct()).resolve("default.jpg");
            return new FileSystemResource(defaultFile.toFile());
        }
    }
}
