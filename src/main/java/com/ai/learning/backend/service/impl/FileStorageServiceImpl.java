package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.FileMetadataRequest;
import com.ai.learning.backend.dto.response.FileMetadataResponse;
import com.ai.learning.backend.entity.FileMetadata;
import com.ai.learning.backend.entity.ProcessJob;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.enums.StorageProvider;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.FileMetadataMapper;
import com.ai.learning.backend.repository.FileMetadataRepository;
import com.ai.learning.backend.repository.ProcessJobRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.FileStorageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileStorageServiceImpl implements FileStorageService {
    FileMetadataRepository fileMetadataRepository;
    FileMetadataMapper mapper;
    UserRepository userRepository;
    private final FileMetadataMapper fileMetadataMapper;
    ProcessJobRepository processJobRepository;
    ProcessJobImpl processJobService;

    @NonFinal
    @Value("${app.upload.dir}")
    String uploadDir;

    @Override
    public FileMetadataResponse storeFile(MultipartFile multipartFile, FileMetadataRequest request) {
        String identity = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser;

        try {
            Integer userId = Integer.valueOf(identity);
            currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        } catch (NumberFormatException e) {
            currentUser = userRepository.findByUsername(identity)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        }

        //Create temp entity
        FileMetadata entity = FileMetadata.builder()
                .title(request.getTitle())
                .storageProvider(request.getStorageProvider())
                .user(currentUser)
                .build();



        //Logic Hybrid
        if(request.getStorageProvider() == StorageProvider.YOUTUBE) {
            entity.setUrl(request.getYoutubeUrl());
            entity.setContentType("video/youtube");
            entity.setSize(0L);
        } else {
            if(multipartFile== null || multipartFile.isEmpty()) {
                throw new AppException(ErrorCode.UPLOAD_FAILED);
            }

            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path targetPath = Paths.get(uploadDir).resolve(fileName);
                Files.createDirectories(targetPath.getParent());
                Files.copy(multipartFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

                entity.setUrl((targetPath.toString()));
                entity.setContentType(multipartFile.getContentType());
                entity.setSize(multipartFile.getSize());
            } catch (IOException e) {
                throw new AppException(ErrorCode.UPLOAD_FAILED);
            }
        }

        FileMetadata saved = fileMetadataRepository.save(entity);

        ProcessJob job = ProcessJob.builder()
                .fileMetadata(saved)
                .status(SessionStatus.PROCESSING)
                .build();

        ProcessJob savedJob = processJobRepository.saveAndFlush(job);

        System.out.println("Đã tạo Job với ID: " + savedJob.getProcessJobId());

        processJobService.startProcessAsync(savedJob.getProcessJobId());

        return mapper.toResponse(saved);
    }

    @Override
    public List<FileMetadataResponse> getMyVideos() {
        String identity = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer userId;

        try {
            userId = Integer.valueOf(identity);
        } catch (NumberFormatException e) {
            userId = userRepository.findByUsername(identity)
                    .map(User::getUserId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        }

        return  fileMetadataRepository.findByUser_UserId(userId).stream()
                .map(fileMetadataMapper::toResponse)
                .toList();
    }
}
