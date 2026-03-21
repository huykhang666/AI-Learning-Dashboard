package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.FileMetadataRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.FileMetadataResponse;
import com.ai.learning.backend.service.FileStorageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UploadController {
    FileStorageService fileStorageService;

    @PostMapping(value = "/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileMetadataResponse> uploadVideo(
            @RequestPart("file")MultipartFile multipartFile,
            @RequestPart("metadata")FileMetadataRequest request
    ) {
        return ApiResponse.<FileMetadataResponse>builder()
                .result(fileStorageService.storeFile(multipartFile,request))
                .build();
    }
}
