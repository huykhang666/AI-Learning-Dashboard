package com.ai.learning.backend.payment.config;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@Getter
public class MoMoConfig {
    @Value("${momo.partner-code}")
    private String partnerCode;

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.endpoint}")
    private String endpoint;

    @Value("${momo.return-url}")
    private String returnUrl;

    @Value("${momo.notify-url}")
    private String notifyUrl;

    public String hmacSHA256(String data) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA256");
        hmac.init(new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] result = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : result) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
