package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.ProcessJob;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessJobRepository extends JpaRepository<ProcessJob,Long> {
    Optional<ProcessJob> findByFileMetadata_FileMetadataId(Long fileMetadataId);
    Optional<ProcessJob> findByLearningSession_LearningSessionId(Long learningSessionId);
    @Modifying
    @Transactional
    @Query("UPDATE ProcessJob j SET j.progress = :value, j.updatedAt = CURRENT_TIMESTAMP WHERE j.processJobId = :jobId")
    void updateProgressOnly(@Param("jobId") Long jobId, @Param("value") int value);

}

