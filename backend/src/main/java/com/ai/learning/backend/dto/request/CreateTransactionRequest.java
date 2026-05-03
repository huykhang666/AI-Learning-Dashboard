package com.ai.learning.backend.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateTransactionRequest {
    Long userId;
    Long courseId;
    String paymentMethod;
}
