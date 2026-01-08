package com.jobtracker.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    String store(MultipartFile file, String subDirectory) throws IOException;

    void delete(String filePath) throws IOException;

    Resource loadAsResource(String filePath) throws IOException;
}
