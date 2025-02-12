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
public class CloudflareR2Config {

    @Bean
    public S3Client s3Client(){
        return S3Client.builder()
                .region(Region.of("eeur"))
                .endpointOverride(URI.create("https://ca131d35c9e4a57d41a0c5bebb2fe227.r2.cloudflarestorage.com/ecosphere"))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("313973784a707d2cf4892384d52eaf35","400fa44e50364eb318b7ac69731401e432e2f27c3bc217d27b56fa5d5be16785")))
                .build();
    }

}
