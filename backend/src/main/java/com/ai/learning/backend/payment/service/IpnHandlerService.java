package com.ai.learning.backend.payment.service;

import com.ai.learning.backend.payment.dto.response.IpnResponse;

import java.util.Map;

public interface IpnHandlerService {
    IpnResponse handle(Map<String, String> params);
}
