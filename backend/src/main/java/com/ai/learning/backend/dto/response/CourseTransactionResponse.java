package com.ai.learning.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseTransactionResponse {
    Long transactionId;
    Long userId;
    String courseTitle;
    Double amount;
    String vnpTxnRef;
    String status;
    LocalDateTime createdAt;
}
