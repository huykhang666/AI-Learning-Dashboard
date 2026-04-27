package com.ai.learning.backend.payment.service;

import com.ai.learning.backend.entity.Payment;
import com.ai.learning.backend.payment.config.VnPayConfig;
import com.ai.learning.backend.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final VnPayConfig vnPayConfig;
    private final PaymentRepository paymentRepository;

    public String createPaymentUrl(Long userId, Integer amount, HttpServletRequest request) {

        // 1. Dùng JPA để tạo và lưu đơn hàng vào DB
        Payment newPayment = Payment.builder()
                .userId(userId)
                .amount(amount)
                .status("PENDING")
                .paymentMethod("VNPAY")
                .build();

        // Hàm save() sẽ tự động tạo UUID mới và trả về object đã lưu
        Payment savedPayment = paymentRepository.save(newPayment);
        String vnp_TxnRef = savedPayment.getPaymentId().toString();

        // 2. Cấu hình các thông số gửi sang VNPay
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", vnPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnp_TmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnPayConfig.getIpAddress(request));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
    }

    public Map<String, String> processIpn(Map<String, String> params) {
        Map<String, String> response = new HashMap<>();
        try {
            // 1. Lấy chữ ký do VNPay gửi về
            String vnp_SecureHash = params.get("vnp_SecureHash");
            if (vnp_SecureHash == null) {
                response.put("RspCode", "99");
                response.put("Message", "Missing Signature");
                return response;
            }

            // 2. Xóa các tham số không tham gia vào quá trình tạo chữ ký
            params.remove("vnp_SecureHashType");
            params.remove("vnp_SecureHash");

            // 3. Sắp xếp lại các tham số theo thứ tự A-Z
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();

            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            // 4. Tạo chữ ký mới từ dữ liệu gửi về và so sánh với chữ ký của VNPay
            String checkSum = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());

            if (checkSum.equals(vnp_SecureHash)) {
                // Chữ ký chuẩn xác -> Giao dịch đáng tin cậy
                String paymentIdStr = params.get("vnp_TxnRef");

                if ("00".equals(params.get("vnp_ResponseCode"))) {
                    try {
                        // Chuyển String thành UUID để tìm trong Database
                        UUID paymentId = UUID.fromString(paymentIdStr);
                        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);

                        if (paymentOpt.isPresent()) {
                            Payment payment = paymentOpt.get();

                            // Kiểm tra xem đơn hàng đã được cập nhật trước đó chưa (tránh cộng tiền 2 lần)
                            if ("PENDING".equals(payment.getStatus())) {
                                payment.setStatus("SUCCESS");
                                // Lưu thêm mã giao dịch thật của VNPay để sau này đối soát nếu cần
                                // payment.setGatewayTransactionId(params.get("vnp_TransactionNo"));

                                paymentRepository.save(payment);
                                System.out.println("Đã cập nhật trạng thái đơn hàng " + paymentIdStr + " thành SUCCESS!");

                                response.put("RspCode", "00");
                                response.put("Message", "Confirm Success");
                            } else {
                                // Đơn hàng đã được thanh toán thành công từ trước
                                response.put("RspCode", "02");
                                response.put("Message", "Order already confirmed");
                            }
                        } else {
                            // Không tìm thấy đơn hàng trong Database
                            response.put("RspCode", "01");
                            response.put("Message", "Order not found");
                        }
                    } catch (IllegalArgumentException e) {
                        // Lỗi nếu mã paymentIdStr không phải là UUID hợp lệ
                        response.put("RspCode", "01");
                        response.put("Message", "Invalid Order ID");
                    }
                } else {
                    // VNPay trả về mã lỗi (khách hủy thanh toán, không đủ tiền...)
                    System.out.println("Khách hàng thanh toán thất bại/hủy giao dịch cho đơn: " + paymentIdStr);
                    response.put("RspCode", "00"); // Vẫn trả 00 để VNPay biết là đã nhận được thông báo
                    response.put("Message", "Transaction Failed but IPN received");
                }
            } else {
                response.put("RspCode", "97");
                response.put("Message", "Invalid Checksum");
            }
        } catch (Exception e) {
            response.put("RspCode", "99");
            response.put("Message", "Unknown Error");
        }
        return response;
    }
}