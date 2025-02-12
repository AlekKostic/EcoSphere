package com.example.Backend.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class S3Config {

    private String accessKey = "AKIAW5WU5ALCUUDOJXMN";

    private String secretKey = "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";

    private String region = "eu-north-1";

    @Bean
    public S3Client s3Client(){
        return S3Client.builder().region(Region.of(region)).credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))).build();
    }
}
