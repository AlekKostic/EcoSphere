package com.example.Backend.Controllers;

import com.example.Backend.Services.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file){
        try {
            String fileUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }
}
