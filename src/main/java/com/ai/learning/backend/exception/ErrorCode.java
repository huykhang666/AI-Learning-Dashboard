package com.ai.learning.backend.exception;

import lombok.Getter;
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
    INVALID_EMAIL(1008,"Invalid email format",HttpStatus.BAD_REQUEST),
    //Security error
    UNAUTHORIZED(1007, "You do not have access.", HttpStatus.UNAUTHORIZED),


    //REQUIRED
    EMAIL_IS_REQUIRED(1009,"Email is required",HttpStatus.BAD_REQUEST),
    USERNAME_IS_REQUIRED(1010,"Username is required",HttpStatus.BAD_REQUEST),
    FIRSTNAME_IS_REQUIRED(1011,"Firstname is required",HttpStatus.BAD_REQUEST),
    LASTNAME_IS_REQUIRED(1012,"Lastname is required",HttpStatus.BAD_REQUEST),
    PASSWORD_IS_REQUIRED(1013,"Password is required",HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(1014, "Invalid username or password", HttpStatus.UNAUTHORIZED),

    TOKEN_EXPIRED(1015, "Token has expired", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(1016, "Invalid token", HttpStatus.UNAUTHORIZED),

    FORBIDDEN(1017, "You do not have permission to access this resource", HttpStatus.FORBIDDEN);

    private final int code;
    private final String message;
    private final HttpStatus statusCode;
    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
