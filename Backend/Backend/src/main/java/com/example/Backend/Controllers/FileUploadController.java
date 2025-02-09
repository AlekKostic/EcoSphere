package com.example.Backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@RestController
@RequestMapping("/r2/upload")
public class FileUploadController {

    @Autowired
    private S3Client s3Client;


    @Value("${CF_R2_BUCKET_NAME}")
    private String bucketName;

    @Value("${CF_R2_ACCOUNT_ID}")
    private String accountID;

    @Value("${CF_R2_ENDPOINT}")
    private String endpointUrl;

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file")MultipartFile file){
        try{
            String fileName = file.getOriginalFilename();
            String objectKey = "uploads/" + fileName;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName).key(objectKey).contentType(file.getContentType()).build();
            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

            String fileUrl = endpointUrl + "/" + bucketName + "/" + objectKey;

            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }
}
