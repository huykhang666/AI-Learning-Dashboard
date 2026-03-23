package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.ProcessJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessJobRepository extends JpaRepository<ProcessJob,Long> {
    Optional<ProcessJob> findByLearningSession_SessionId(Long sessionId);

    Optional<ProcessJob> findByFileMetadata_FileStorageId(Long sessionId);
}
