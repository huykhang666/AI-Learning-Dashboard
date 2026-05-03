package com.ai.learning.backend.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponse {
    Long transactionId;
    String courseTitle;
    String status;
    Double amount;
    String vnpTxnRef;
    LocalDateTime createdAt;
}
