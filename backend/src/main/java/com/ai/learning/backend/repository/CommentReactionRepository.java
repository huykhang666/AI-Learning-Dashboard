package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.CommentReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {
    Optional<CommentReaction> findByCommentCommentIdAndUserUserId(Long commentId, Long userId);
}
