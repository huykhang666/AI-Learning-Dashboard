package com.ai.learning.backend.payment.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@Getter
@Slf4j
public class VnPayConfig {

    // Nạp các cấu hình từ file application.yaml hoặc môi trường (Đã gài sẵn Key Sandbox)
    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.secret-key}")
    private String secretKey;

    @Value("${vnpay.pay-url}")
    private String vnp_PayUrl;

    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    @Value("${vnpay.ipn-url}")
    private String vnp_IpnUrl;

    // Các hằng số mặc định của VNPay
    public String vnp_Version = "2.1.0";
    public String vnp_Command = "pay";


    /**
     * Hàm băm (Hash) chuỗi dữ liệu bằng thuật toán HMAC-SHA512 để tạo chữ ký bảo mật
     * @param key Chuỗi Secret Key
     * @param data Dữ liệu đã được sắp xếp cần mã hóa
     * @return Chuỗi chữ ký (Signature/Secure Hash)
     */
    public String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) throw new NullPointerException();

            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"
            );
            hmac512.init(secretKeySpec);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder(128);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }

            while (sb.length() < 128) {
                sb.insert(0, '0');
            }
            log.info("Hash length: {}, hash: {}", sb.toString().length(), sb.toString());
            return sb.toString();

        } catch (Exception ex) {
            log.error("HMAC-SHA512 error", ex);
            return "";
        }
    }

    /**
     * Lấy IP của người dùng (VNPay bắt buộc phải có thông số vnp_IpAddr)
     */
    public String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getRemoteAddr();
            }

            if ("0:0:0:0:0:0:0:1".equals(ipAddress) || "::1".equals(ipAddress)) {
                ipAddress = "127.0.0.1";
            }

        } catch (Exception e) {
            ipAddress = "127.0.0.1";
        }
        return ipAddress;
    }


}