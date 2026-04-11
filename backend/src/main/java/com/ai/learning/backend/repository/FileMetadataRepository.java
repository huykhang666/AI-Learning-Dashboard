package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata,Long> {
    List<FileMetadata> findByUser_UserId(Long userId);
    Optional<FileMetadata> findByFileName(String fileName);
    Optional<FileMetadata> findByLearningSession_LearningSessionId(Long sessionId);}
