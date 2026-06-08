package com.ai.learning.backend.controller;

import com.ai.learning.backend.dto.request.CommentRequest;
import com.ai.learning.backend.dto.response.ApiResponse;
import com.ai.learning.backend.dto.response.CommentResponse;
import com.ai.learning.backend.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping
    public ApiResponse<CommentResponse> addComment(@RequestBody CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .result(commentService.addComment(request))
                .build();
    }

    @GetMapping("/lesson/{lessonId}")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Long lessonId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .code(1000)
                .result(commentService.getCommentsByLesson(lessonId))
                .build();
    }

    @PostMapping("/{commentId}/like")
    public ApiResponse<CommentResponse> likeComment(@PathVariable Long commentId) {
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .result(commentService.likeComment(commentId))
                .build();
    }

    @PostMapping("/{commentId}/dislike")
    public ApiResponse<CommentResponse> dislikeComment(@PathVariable Long commentId) {
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .result(commentService.dislikeComment(commentId))
                .build();
    }
}
