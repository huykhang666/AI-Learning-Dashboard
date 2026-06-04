package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.dto.QuizExportDto;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public ByteArrayInputStream exportSummaryToPdf(String title, String content) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font contentFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            Paragraph titlePara = new Paragraph(title, titleFont);
            titlePara.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(titlePara);

            document.add(new Paragraph(" "));

            Paragraph contentPara = new Paragraph(content, contentFont);
            document.add(contentPara);

            document.close();

        } catch (Exception e) {
            System.out.println("Lỗi khi tạo PDF: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportInvoiceToPdf(Payment payment) {
        Document document = new Document(PageSize.A4, 40, 40, 60, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            String regularPath = "/fonts/Roboto-Regular.ttf";
            String boldPath = "/fonts/Roboto-Bold.ttf";

            byte[] regularBytes = new ClassPathResource("fonts/Roboto-Regular.ttf").getInputStream().readAllBytes();

            BaseFont bfRegular = BaseFont.createFont(
                    "Roboto-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, regularBytes, null
            );
            BaseFont bfBold = bfRegular;

            // Bảng màu
            Color indigo      = new Color(63, 81, 181);
            Color indigoLight = new Color(232, 234, 252);
            Color red         = new Color(198, 40, 40);
            Color redLight    = new Color(255, 235, 235);
            Color gray        = new Color(97, 97, 97);
            Color darkGray    = new Color(33, 33, 33);
            Color tableHeader = new Color(225, 228, 250);
            Color rowAlt      = new Color(245, 246, 255);

            // Fonts
            Font fontBrand    = new Font(bfBold,    26, Font.NORMAL, indigo);
            Font fontSubtitle = new Font(bfRegular, 10, Font.NORMAL, gray);
            Font fontH2       = new Font(bfBold,    11, Font.NORMAL, darkGray);
            Font fontBold     = new Font(bfBold,    10, Font.NORMAL, darkGray);
            Font fontNormal   = new Font(bfRegular, 10, Font.NORMAL, darkGray);
            Font fontSmall    = new Font(bfRegular,  9, Font.NORMAL, gray);
            Font fontTotal    = new Font(bfBold,    13, Font.NORMAL, red);
            Font fontTableH   = new Font(bfBold,    10, Font.NORMAL, indigo);
            Font fontWhite    = new Font(bfBold,    14, Font.NORMAL, Color.WHITE);

            // ── HEADER BANNER ──
            PdfPTable banner = new PdfPTable(1);
            banner.setWidthPercentage(100);
            banner.setSpacingAfter(0);

            PdfPCell bannerCell = new PdfPCell();
            bannerCell.setBackgroundColor(indigo);
            bannerCell.setPadding(20);
            bannerCell.setBorder(Rectangle.NO_BORDER);

            Paragraph brandLine = new Paragraph("AI LEARNING DASHBOARD", fontWhite);
            brandLine.setAlignment(Element.ALIGN_CENTER);
            bannerCell.addElement(brandLine);

            Paragraph tagline = new Paragraph("Nền tảng học tập thông minh với AI",
                    new Font(bfRegular, 10, Font.NORMAL, indigoLight));
            tagline.setAlignment(Element.ALIGN_CENTER);
            bannerCell.addElement(tagline);

            banner.addCell(bannerCell);
            document.add(banner);

            // ── TIÊU ĐỀ HÓA ĐƠN ──
            PdfPTable titleBar = new PdfPTable(1);
            titleBar.setWidthPercentage(100);
            titleBar.setSpacingAfter(16);

            PdfPCell titleCell = new PdfPCell();
            titleCell.setBackgroundColor(indigoLight);
            titleCell.setPadding(10);
            titleCell.setBorder(Rectangle.NO_BORDER);

            Paragraph invoiceTitle = new Paragraph("HÓA ĐƠN THANH TOÁN",
                    new Font(bfBold, 14, Font.NORMAL, indigo));
            invoiceTitle.setAlignment(Element.ALIGN_CENTER);
            titleCell.addElement(invoiceTitle);
            titleBar.addCell(titleCell);
            document.add(titleBar);

            // ── THÔNG TIN 2 CỘT ──
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(16);

            // Cột trái: Khách hàng
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.BOX);
            leftCell.setBorderColor(indigoLight);
            leftCell.setBackgroundColor(new Color(250, 250, 255));
            leftCell.setPadding(12);

            leftCell.addElement(new Paragraph("THÔNG TIN KHÁCH HÀNG", fontH2));
            leftCell.addElement(new Paragraph(" ", fontSmall));
            String customerName =
                    (payment.getUser().getFirstName() != null ? payment.getUser().getFirstName() : "") + " " +
                            (payment.getUser().getLastName()  != null ? payment.getUser().getLastName()  : payment.getUser().getUsername());
            leftCell.addElement(new Paragraph("Họ tên:     " + customerName.trim(), fontNormal));
            leftCell.addElement(new Paragraph("Tài khoản:  " + payment.getUser().getUsername(), fontNormal));
            leftCell.addElement(new Paragraph("Email:      " + payment.getUser().getEmail(), fontNormal));
            infoTable.addCell(leftCell);

            // Cột phải: Chi tiết hóa đơn
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.BOX);
            rightCell.setBorderColor(indigoLight);
            rightCell.setBackgroundColor(new Color(250, 250, 255));
            rightCell.setPadding(12);

            rightCell.addElement(new Paragraph("CHI TIẾT HÓA ĐƠN", fontH2));
            rightCell.addElement(new Paragraph(" ", fontSmall));
            rightCell.addElement(new Paragraph("Mã hóa đơn:      " + payment.getPaymentId().toString().substring(0, 8).toUpperCase(), fontBold));
            rightCell.addElement(new Paragraph("Cổng thanh toán: " + payment.getGateway().name(), fontNormal));
            if (payment.getGatewayTransactionId() != null) {
                rightCell.addElement(new Paragraph("Mã giao dịch:    " + payment.getGatewayTransactionId(), fontNormal));
            }
            rightCell.addElement(new Paragraph("Ngày thanh toán: " +
                    payment.getCreatedAt().toString().replace("T", " ").substring(0, 19), fontNormal));
            infoTable.addCell(rightCell);

            document.add(infoTable);

            // ── BẢNG DỊCH VỤ ──
            PdfPTable itemTable = new PdfPTable(3);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new int[]{5, 3, 3});
            itemTable.setSpacingAfter(12);

            // Header bảng
            String[] headers = {"Mô tả dịch vụ", "Gói đăng ký", "Thành tiền"};
            int[] aligns = {Element.ALIGN_LEFT, Element.ALIGN_CENTER, Element.ALIGN_RIGHT};
            for (int i = 0; i < headers.length; i++) {
                PdfPCell h = new PdfPCell(new Phrase(headers[i], fontTableH));
                h.setBackgroundColor(tableHeader);
                h.setPadding(9);
                h.setHorizontalAlignment(aligns[i]);
                h.setBorderColor(indigo);
                itemTable.addCell(h);
            }

            // Row dữ liệu
            String desc = payment.getOrderInfo() != null ? payment.getOrderInfo() : "Nâng cấp tài khoản lên gói Premium";
            String duration = payment.getPlanType() != null ? payment.getPlanType().name() : "PREMIUM";
            String currencyName = payment.getCurrency() != null ? payment.getCurrency().name() : "VND";
            String price = String.format("%,.0f %s", payment.getAmount().doubleValue(), currencyName);

            String[] values = {desc, duration, price};
            for (int i = 0; i < values.length; i++) {
                PdfPCell c = new PdfPCell(new Phrase(values[i], fontNormal));
                c.setPadding(9);
                c.setBackgroundColor(rowAlt);
                c.setHorizontalAlignment(aligns[i]);
                c.setBorderColor(indigoLight);
                itemTable.addCell(c);
            }

            document.add(itemTable);

            // ── TỔNG TIỀN ──
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(100);
            totalTable.setWidths(new int[]{6, 5});
            totalTable.setSpacingAfter(24);

            PdfPCell emptyCell = new PdfPCell();
            emptyCell.setBorder(Rectangle.NO_BORDER);
            totalTable.addCell(emptyCell);

            PdfPCell totalCell = new PdfPCell();
            totalCell.setPadding(14);
            totalCell.setBackgroundColor(redLight);
            totalCell.setBorderColor(red);

            Paragraph totalPara = new Paragraph("TỔNG THANH TOÁN: " + price, fontTotal);
            totalPara.setAlignment(Element.ALIGN_RIGHT);
            totalCell.addElement(totalPara);
            totalTable.addCell(totalCell);
            document.add(totalTable);

            // ── FOOTER ──
            PdfPTable footerTable = new PdfPTable(1);
            footerTable.setWidthPercentage(100);

            PdfPCell footerCell = new PdfPCell();
            footerCell.setBackgroundColor(indigo);
            footerCell.setPadding(14);
            footerCell.setBorder(Rectangle.NO_BORDER);

            Paragraph footerText = new Paragraph(
                    "Cảm ơn bạn đã sử dụng AI Learning Dashboard!\n" +
                            "Tài khoản của bạn đã được kích hoạt đầy đủ tính năng Premium.",
                    new Font(bfRegular, 10, Font.NORMAL, Color.WHITE)
            );
            footerText.setAlignment(Element.ALIGN_CENTER);
            footerCell.addElement(footerText);

            Paragraph contact = new Paragraph("support@ailearning.com  |  localhost:5173",
                    new Font(bfRegular, 9, Font.NORMAL, indigoLight));
            contact.setAlignment(Element.ALIGN_CENTER);
            footerCell.addElement(contact);

            footerTable.addCell(footerCell);
            document.add(footerTable);

            document.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportQuizToPdf(
            String videoTitle,
            java.util.List<QuizExportDto> quizzes) {
        Document document = new Document(PageSize.A4, 40, 40, 60, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            byte[] regularBytes = new ClassPathResource("fonts/Roboto-Regular.ttf").getInputStream().readAllBytes();
            byte[] boldBytes    = new ClassPathResource("fonts/Roboto-Bold.ttf").getInputStream().readAllBytes();

            BaseFont bfRegular = BaseFont.createFont(
                    "Roboto-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, regularBytes, null);
            BaseFont bfBold = BaseFont.createFont(
                    "Roboto-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, boldBytes, null);

            // ── MÀU SẮC ──
            Color indigo      = new Color(63, 81, 181);
            Color indigoLight = new Color(232, 234, 252);
            Color gold        = new Color(180, 130, 0);
            Color goldLight   = new Color(255, 249, 220);
            Color gray        = new Color(97, 97, 97);
            Color darkGray    = new Color(33, 33, 33);
            Color green       = new Color(27, 130, 80);
            Color greenLight  = new Color(220, 255, 235);
            Color rowAlt      = new Color(245, 246, 255);

            // ── FONTS ──
            Font fontWhite    = new Font(bfBold,    14, Font.NORMAL, Color.WHITE);
            Font fontWhiteSm  = new Font(bfRegular, 10, Font.NORMAL, new Color(232, 234, 252));
            Font fontTitle    = new Font(bfBold,    14, Font.NORMAL, indigo);
            Font fontVideoTitle = new Font(bfBold,  11, Font.NORMAL, darkGray);
            Font fontQ        = new Font(bfBold,    11, Font.NORMAL, darkGray);
            Font fontOption   = new Font(bfRegular, 10, Font.NORMAL, darkGray);
            Font fontCorrect  = new Font(bfBold,    10, Font.NORMAL, green);
            Font fontExplain  = new Font(bfRegular,  9, Font.ITALIC, gray);
            Font fontFooter   = new Font(bfRegular, 10, Font.NORMAL, Color.WHITE);
            Font fontFooterSm = new Font(bfRegular,  9, Font.NORMAL, new Color(232, 234, 252));
            Font fontIndex    = new Font(bfBold,    11, Font.NORMAL, Color.WHITE);

            // ══════════════════════════════════════
            // HEADER BANNER
            // ══════════════════════════════════════
            PdfPTable banner = new PdfPTable(1);
            banner.setWidthPercentage(100);
            banner.setSpacingAfter(0);

            PdfPCell bannerCell = new PdfPCell();
            bannerCell.setBackgroundColor(indigo);
            bannerCell.setPadding(20);
            bannerCell.setBorder(Rectangle.NO_BORDER);

            Paragraph brandLine = new Paragraph("AI LEARNING DASHBOARD", fontWhite);
            brandLine.setAlignment(Element.ALIGN_CENTER);
            bannerCell.addElement(brandLine);

            Paragraph tagline = new Paragraph("Bộ câu hỏi trắc nghiệm tự động từ bài giảng", fontWhiteSm);
            tagline.setAlignment(Element.ALIGN_CENTER);
            bannerCell.addElement(tagline);
            banner.addCell(bannerCell);
            document.add(banner);

            // ══════════════════════════════════════
            // TIÊU ĐỀ VIDEO
            // ══════════════════════════════════════
            PdfPTable titleBar = new PdfPTable(1);
            titleBar.setWidthPercentage(100);
            titleBar.setSpacingAfter(16);

            PdfPCell titleCell = new PdfPCell();
            titleCell.setBackgroundColor(indigoLight);
            titleCell.setPadding(10);
            titleCell.setBorder(Rectangle.NO_BORDER);

            Paragraph quizTitle = new Paragraph("BÀI KIỂM TRA TRẮC NGHIỆM", fontTitle);
            quizTitle.setAlignment(Element.ALIGN_CENTER);
            titleCell.addElement(quizTitle);

            Paragraph videoTitlePara = new Paragraph("Nguồn: " + videoTitle, fontVideoTitle);
            videoTitlePara.setAlignment(Element.ALIGN_CENTER);
            titleCell.addElement(videoTitlePara);

            titleBar.addCell(titleCell);
            document.add(titleBar);

            // ══════════════════════════════════════
            // DANH SÁCH CÂU HỎI
            // ══════════════════════════════════════
            String[] optionLabels = {"A", "B", "C", "D"};

            for (int qi = 0; qi < quizzes.size(); qi++) {
                QuizExportDto quiz = quizzes.get(qi);

                // ── Khối câu hỏi ──
                PdfPTable qTable = new PdfPTable(new float[]{1, 11});
                qTable.setWidthPercentage(100);
                qTable.setSpacingAfter(4);
                qTable.setSpacingBefore(qi == 0 ? 0 : 10);

                // Số thứ tự
                PdfPCell indexCell = new PdfPCell();
                indexCell.setBackgroundColor(indigo);
                indexCell.setBorder(Rectangle.NO_BORDER);
                indexCell.setPadding(8);
                indexCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                Paragraph indexPara = new Paragraph(String.valueOf(qi + 1), fontIndex);
                indexPara.setAlignment(Element.ALIGN_CENTER);
                indexCell.addElement(indexPara);
                qTable.addCell(indexCell);

                // Nội dung câu hỏi
                PdfPCell qCell = new PdfPCell();
                qCell.setBackgroundColor(rowAlt);
                qCell.setBorder(Rectangle.NO_BORDER);
                qCell.setPadding(10);
                qCell.addElement(new Paragraph(quiz.getQuestion(), fontQ));
                qTable.addCell(qCell);
                document.add(qTable);

                // ── Các đáp án ──
                for (int i = 0; i < quiz.getOptions().size(); i++) {
                    boolean isCorrect = (i == quiz.getCorrectIndex());

                    PdfPTable optTable = new PdfPTable(new float[]{1, 11});
                    optTable.setWidthPercentage(97);
                    optTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    optTable.setSpacingAfter(2);

                    // Label A/B/C/D
                    PdfPCell labelCell = new PdfPCell();
                    labelCell.setBackgroundColor(isCorrect ? green : new Color(200, 200, 210));
                    labelCell.setBorder(Rectangle.NO_BORDER);
                    labelCell.setPadding(6);
                    labelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    Font labelFont = new Font(bfBold, 10, Font.NORMAL, Color.WHITE);
                    Paragraph labelPara = new Paragraph(optionLabels[i], labelFont);
                    labelPara.setAlignment(Element.ALIGN_CENTER);
                    labelCell.addElement(labelPara);
                    optTable.addCell(labelCell);

                    // Nội dung đáp án
                    PdfPCell optCell = new PdfPCell();
                    optCell.setBackgroundColor(isCorrect ? greenLight : Color.WHITE);
                    optCell.setBorder(Rectangle.BOX);
                    optCell.setBorderColor(isCorrect ? green : new Color(220, 220, 230));
                    optCell.setPadding(7);

                    Font usedFont = isCorrect ? fontCorrect : fontOption;
                    String prefix = isCorrect ? "✓ " : "";
                    optCell.addElement(new Paragraph(prefix + quiz.getOptions().get(i), usedFont));
                    optTable.addCell(optCell);
                    document.add(optTable);
                }

                // ── Giải thích ──
                PdfPTable explainTable = new PdfPTable(1);
                explainTable.setWidthPercentage(97);
                explainTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
                explainTable.setSpacingAfter(6);

                PdfPCell explainCell = new PdfPCell();
                explainCell.setBackgroundColor(goldLight);
                explainCell.setBorderColor(gold);
                explainCell.setPadding(8);
                explainCell.addElement(new Paragraph("Giải thích: " + quiz.getExplanation(), fontExplain));
                explainTable.addCell(explainCell);
                document.add(explainTable);
            }

            // ══════════════════════════════════════
            // FOOTER
            // ══════════════════════════════════════
            PdfPTable footerTable = new PdfPTable(1);
            footerTable.setWidthPercentage(100);
            footerTable.setSpacingBefore(20);

            PdfPCell footerCell = new PdfPCell();
            footerCell.setBackgroundColor(indigo);
            footerCell.setPadding(14);
            footerCell.setBorder(Rectangle.NO_BORDER);

            Paragraph footerText = new Paragraph(
                    "Bộ câu hỏi được tạo tự động bởi AI Learning Dashboard",
                    fontFooter);
            footerText.setAlignment(Element.ALIGN_CENTER);
            footerCell.addElement(footerText);

            Paragraph contact = new Paragraph(
                    "© 2026 AI Learning Dashboard  |  huykhang666@gmail.com  |  http://ai-learning-dashboard.id.vn/",
                    fontFooterSm);
            contact.setAlignment(Element.ALIGN_CENTER);
            footerCell.addElement(contact);

            footerTable.addCell(footerCell);
            document.add(footerTable);

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}