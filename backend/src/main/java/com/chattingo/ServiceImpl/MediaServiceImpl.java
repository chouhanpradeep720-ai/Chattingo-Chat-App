package com.chattingo.ServiceImpl;

import com.chattingo.Service.MediaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class MediaServiceImpl implements MediaService {

    @Value("${chattingo.media.upload-dir:uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 25 * 1024 * 1024;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp",
            "mp4", "mov", "webm",
            "mp3", "wav", "ogg", "m4a",
            "pdf", "doc", "docx",
            "xls", "xlsx", "ppt", "pptx",
            "txt", "csv", "zip"
    );

    @Override
    public String uploadFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size cannot exceed 25 MB");
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Invalid filename");
        }

        String extension = "";

        int dotIndex = originalFilename.lastIndexOf('.');

        if (dotIndex >= 0 && dotIndex < originalFilename.length() - 1) {
            extension = originalFilename.substring(dotIndex + 1)
                    .toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type is not supported");
        }

        String uniqueFilename = UUID.randomUUID() + "." + extension;

        Path uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(uploadPath);

        Path destination = uploadPath.resolve(uniqueFilename).normalize();

        if (!destination.startsWith(uploadPath)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        Files.copy(file.getInputStream(), destination);

        return "/uploads/" + uniqueFilename;
    }
}
