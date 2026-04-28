package com.ai.learning.backend.payment.service;

import com.ai.learning.backend.payment.dto.request.MomoRequest;
import com.ai.learning.backend.payment.dto.response.MomoResponse;

public interface MomoService {
    MomoResponse createPayment(MomoRequest request);
}
