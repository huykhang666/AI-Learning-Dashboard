package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.FileMetadataRequest;
import com.ai.learning.backend.dto.response.FileMetadataResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    FileMetadataResponse storeFile(MultipartFile file, FileMetadataRequest request);
}
