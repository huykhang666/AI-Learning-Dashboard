package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.FileMetadataRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.FileMetadataResponse;
import com.ai.learning.backend.service.FileStorageService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UploadController {
    FileStorageService fileStorageService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping(value = "/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileMetadataResponse> uploadVideo(
            @RequestPart("file")MultipartFile multipartFile,
            @RequestPart("metadata") @Valid FileMetadataRequest request
    ) {
        return ApiResponse.<FileMetadataResponse>builder()
                .code(1000)
                .result(fileStorageService.storeFile(multipartFile,request))
                .build();
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my-videos")
    public ApiResponse<List<FileMetadataResponse>> getMyVideos() {
        return  ApiResponse.<List<FileMetadataResponse>>builder()
                .code(1000)
                .result(fileStorageService.getMyVideos())
                .build();
    }
}
