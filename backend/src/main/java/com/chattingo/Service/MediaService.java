package com.chattingo.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MediaService {

    String uploadFile(MultipartFile file) throws IOException;
}
