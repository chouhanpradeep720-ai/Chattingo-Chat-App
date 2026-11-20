package com.chattingo.Controller;

import com.chattingo.Model.User;
import com.chattingo.Service.MediaService;
import com.chattingo.ServiceImpl.UserServiceImpl;
import com.chattingo.Exception.UserException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFileHandler(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String jwt) {

        try {
            // Authenticate user
            User user = userService.findUserProfile(jwt);

            // Upload file
            String fileUrl = mediaService.uploadFile(file);

            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            response.put("contentType", file.getContentType());
            response.put("fileSize", file.getSize());
            response.put("uploadedBy", user.getId());
            response.put("message", "File uploaded successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired authentication token"));

        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authenticated user not found"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed"));
        }
    }
}
