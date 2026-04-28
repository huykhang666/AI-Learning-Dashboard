package com.ai.learning.backend.payment.service;

import com.ai.learning.backend.payment.dto.request.VNPayRequest;
import com.ai.learning.backend.payment.dto.response.IpnResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VNPayService {

    String createPaymentUrl(VNPayRequest request, HttpServletRequest httpRequest);
    IpnResponse processIpn(Map<String, String> params);
}