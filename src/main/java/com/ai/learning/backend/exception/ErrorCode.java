package com.ai.learning.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter

public enum ErrorCode {
    //Unidentified system error
    UNCATEGORIZED_EXCEPTION(9999, "Unknown system error", HttpStatus.INTERNAL_SERVER_ERROR),

    //User related error
    USER_EXISTED(1001,"The username already exists.",HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1002,"The email already exists.",HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "No user found",HttpStatus.NOT_FOUND),

    //Validation error
    INVALID_KEY(1004,"Invalid error code",HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1005, "Username must have at least 3 characters.",HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1006,"The password must have at least 6 characters.",HttpStatus.BAD_REQUEST),

    //Security error
    UNAUTHORIZED(1007, "You do not have access.", HttpStatus.UNAUTHORIZED);

    private final int code;
    private final String message;
    private final HttpStatus statusCode;
    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }


}
