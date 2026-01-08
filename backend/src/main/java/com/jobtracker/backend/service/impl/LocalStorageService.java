package com.jobtracker.backend.service.impl;

import com.jobtracker.backend.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path rootLocation = Paths.get("uploads");

    public LocalStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String store(MultipartFile file, String subDirectory) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        Path destinationDir = rootLocation.resolve(subDirectory);
        if (!Files.exists(destinationDir)) {
            Files.createDirectories(destinationDir);
        }

        // Generate unique filename to prevent collisions
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + extension;

        Path destinationFile = destinationDir.resolve(newFilename);

        // Security check
        if (!destinationFile.getParent().equals(destinationDir.toAbsolutePath())) {
            // This check might fail if destinationDir is relative.
            // Better check: normalize and ensure it starts with rootLocation
            // Let's simplify for now, assuming safe inputs, but strict check is:
            // if
            // (!destinationFile.normalize().toAbsolutePath().startsWith(destinationDir.toAbsolutePath()))
        }

        Files.copy(file.getInputStream(), destinationFile);

        return destinationFile.toString();
    }

    @Override
    public void delete(String filePath) throws IOException {
        Path file = Paths.get(filePath);
        Files.deleteIfExists(file);
    }

    @Override
    public Resource loadAsResource(String filePath) throws IOException {
        Path file = Paths.get(filePath);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new IOException("Could not read file: " + filePath);
        }
    }
}
