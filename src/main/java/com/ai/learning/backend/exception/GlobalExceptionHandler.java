package com.ai.learning.backend.exception;

import com.ai.learning.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse<?>> handlingRuntimeException(RuntimeException exception) {
        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.FORBIDDEN;
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = (exception.getFieldError() != null)
                ? exception.getFieldError().getDefaultMessage()
                : "INVALID_KEY";

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {}

        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }
}
