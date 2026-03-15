package com.ai.learning.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Integer userId;
    String username;
    String firstname;
    String lastname;
    String email;
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dateOfBirth;
    Set<String> roles;

}
