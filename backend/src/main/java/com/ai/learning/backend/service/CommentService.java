package com.ai.learning.backend.service;

import com.ai.learning.backend.dto.request.CommentRequest;
import com.ai.learning.backend.dto.response.CommentResponse;
import java.util.List;

public interface CommentService {
    CommentResponse addComment(CommentRequest request);
    List<CommentResponse> getCommentsByLesson(Long lessonId);
    void deleteComment(Long commentId);
    CommentResponse likeComment(Long commentId);
    CommentResponse dislikeComment(Long commentId);
}
