package com.ai.learning.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {

    @NotBlank(message = "USERNAME_IS_REQUIRED")
    @Size(min = 3,message = "INVALID_USERNAME")
    String username;

    @NotBlank(message = "FIRSTNAME_IS_REQUIRED")
    String firstName;

    @NotBlank(message = "LASTNAME_IS_REQUIRED")
    String lastName;

    @Size(message = "INVALID_EMAIL")
    @NotBlank(message = "EMAIL_IS_REQUIRED")
    String email;

    @NotBlank(message = "PASSWORD_IS_REQUIRED")
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;
    LocalDate dateOfBirth;
}
