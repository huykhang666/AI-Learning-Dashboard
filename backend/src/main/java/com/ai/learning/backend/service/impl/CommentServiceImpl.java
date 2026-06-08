package com.ai.learning.backend.service.impl;

import com.ai.learning.backend.dto.request.CommentRequest;
import com.ai.learning.backend.dto.response.CommentResponse;
import com.ai.learning.backend.entity.Comment;
import com.ai.learning.backend.entity.Lesson;
import com.ai.learning.backend.entity.User;
import com.ai.learning.backend.exception.AppException;
import com.ai.learning.backend.exception.ErrorCode;
import com.ai.learning.backend.repository.CommentRepository;
import com.ai.learning.backend.repository.LessonRepository;
import com.ai.learning.backend.repository.UserRepository;
import com.ai.learning.backend.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentServiceImpl implements CommentService {
    CommentRepository commentRepository;
    UserRepository userRepository;
    LessonRepository lessonRepository;

    @Override
    public CommentResponse addComment(CommentRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .lesson(lesson)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    @Override
    public List<CommentResponse> getCommentsByLesson(Long lessonId) {
        return commentRepository.findByLessonLessonIdOrderByCreatedAtDesc(lessonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    private CommentResponse mapToResponse(Comment comment) {
        String fullName = "";
        if (comment.getUser().getFirstName() != null) {
            fullName += comment.getUser().getFirstName() + " ";
        }
        if (comment.getUser().getLastName() != null) {
            fullName += comment.getUser().getLastName();
        }
        fullName = fullName.trim();
        if (fullName.isEmpty()) {
            fullName = comment.getUser().getUsername();
        }

        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .username(comment.getUser().getUsername())
                .userFullName(fullName)
                .createdAt(comment.getCreatedAt())
                .likes(comment.getLikes())
                .dislikes(comment.getDislikes())
                .build();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public CommentResponse likeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));
        comment.setLikes(comment.getLikes() + 1);
        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public CommentResponse dislikeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));
        comment.setDislikes(comment.getDislikes() + 1);
        return mapToResponse(commentRepository.save(comment));
    }
}
