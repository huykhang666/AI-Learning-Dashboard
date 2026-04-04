package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.FileMetadataRequest;
import com.ai.learning.backend.dto.response.FileMetadataResponse;
import com.ai.learning.backend.entity.FileMetadata;
import com.ai.learning.backend.entity.LearningSession;
import com.ai.learning.backend.entity.ProcessJob;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.enums.SessionStatus;
import com.ai.learning.backend.enums.StorageProvider;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.mapper.FileMetadataMapper;
import com.ai.learning.backend.repository.FileMetadataRepository;
import com.ai.learning.backend.repository.ProcessJobRepository;
import com.ai.learning.backend.repository.SessionRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.FileStorageService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileStorageServiceImpl implements FileStorageService {
    FileMetadataRepository fileMetadataRepository;
    UserRepository userRepository;
    FileMetadataMapper fileMetadataMapper;
    ProcessJobRepository processJobRepository;
    SessionRepository sessionRepository;
    @NonFinal
    ProcessJobImpl processJobService;

    @Autowired
    public void setProcessJobService(@Lazy ProcessJobImpl processJobService) {
        this.processJobService = processJobService;
    }

    @NonFinal
    @Value("${app.upload.dir:uploads}")
    String uploadDir;

    @Override
    @Transactional
    public FileMetadataResponse storeFile(MultipartFile multipartFile, FileMetadataRequest request) {
        String identity = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser;

        try {
            Long userId = Long.valueOf(identity);
            currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        } catch (NumberFormatException e) {
            currentUser = userRepository.findByUsername(identity)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        }

        //Create temp entity
        FileMetadata entity = FileMetadata.builder()
                .storageProvider(request.getStorageProvider())
                .user(currentUser)
                .build();



        //Logic Hybrid
        if(request.getStorageProvider() == StorageProvider.YOUTUBE) {
            entity.setFileUrl(request.getYoutubeUrl());
            entity.setFileType("video/youtube");
            entity.setSize(0L);
            entity.setFileName("YouTube Video");
        } else {
            if(multipartFile== null || multipartFile.isEmpty()) {
                throw new AppException(ErrorCode.UPLOAD_FAILED);
            }

            try {
                String fileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
                Path targetPath = Paths.get(uploadDir).resolve(fileName);
                Files.createDirectories(targetPath.getParent());
                Files.copy(multipartFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

                entity.setFileUrl((targetPath.toString()));
                entity.setFileType(multipartFile.getContentType());
                entity.setSize(multipartFile.getSize());
                entity.setFileName(multipartFile.getOriginalFilename());
            } catch (IOException e) {
                throw new AppException(ErrorCode.UPLOAD_FAILED);
            }
        }

        FileMetadata saved = fileMetadataRepository.saveAndFlush(entity);

        LearningSession session = LearningSession.builder()
                .user(currentUser)
                .fileMetadata(saved)
                .title(request.getTitle() != null ? request.getTitle() : saved.getFileName())
                .description(request.getDescription() != null ? request.getDescription() : "Mô tả bài học")
                .status(SessionStatus.PROCESSING)
                .createdAt(LocalDateTime.now())
                .build();

        // Dùng saveAndFlush ở đây
        LearningSession savedSession = sessionRepository.saveAndFlush(session);

        saved.setLearningSession(savedSession);
        fileMetadataRepository.saveAndFlush(saved);

        ProcessJob job = ProcessJob.builder()
                .fileMetadata(saved)
                .learningSession(savedSession)
                .status(SessionStatus.PROCESSING)
                .build();

        ProcessJob savedJob = processJobRepository.saveAndFlush(job);


        savedSession.setProcessJob(savedJob);
        sessionRepository.saveAndFlush(savedSession);

        processJobService.startProcessAsync(savedJob.getProcessJobId());

        return fileMetadataMapper.toResponse(saved);
    }

    //Retrieve all video metadata for the current user
    @Override
    public List<FileMetadataResponse> getMyVideos() {
        String identity = SecurityContextHolder.getContext().getAuthentication().getName();
        long userId;

        try {
            userId = Long.parseLong(identity);
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
