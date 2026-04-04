package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.ProcessJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessJobRepository extends JpaRepository<ProcessJob,Long> {
    Optional<ProcessJob> findByFileMetadata_FileMetadataId(Long fileMetadataId);
    Optional<ProcessJob> findByLearningSession_LearningSessionId(Long learningSessionId);
}

