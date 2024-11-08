package com.t3h.e_commerce.service;

import org.springframework.core.io.Resource;

public interface FileService {

    public Resource loadAvatarAsResource(String filename);

    Resource loadImageProduct(String fileName);
}
