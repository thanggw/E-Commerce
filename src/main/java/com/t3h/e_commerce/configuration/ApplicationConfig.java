package com.t3h.e_commerce.configuration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class ApplicationConfig {
    @Value("${storage.root.folder.avatar}")
    private String rootFolderAvatar;
}
