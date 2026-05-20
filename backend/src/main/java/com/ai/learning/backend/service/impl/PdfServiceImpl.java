package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.payment.entity.Payment;
import com.ai.learning.backend.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
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
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font brandFont = new Font(Font.HELVETICA, 24, Font.BOLD, new Color(63, 81, 181)); // Màu xanh Indigo chủ đạo
            Font sectionHeadingFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.DARK_GRAY);
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK);
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
            Font totalFont = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(211, 47, 47)); // Màu đỏ tiền tệ


            Paragraph title = new Paragraph("FLY SPEECH", brandFont);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);

            Paragraph companyInfo = new Paragraph(
                    "AI-Powered Learning Dashboard\n" +
                            "Email: support@flyspeech.com\n" +
                            "Website: localhost:3000\n" +
                            "------------------------------------------------------------------------------------------------------------------------",
                    normalFont
            );
            companyInfo.setSpacingAfter(15);
            document.add(companyInfo);


            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20);

            // Cột trái: Người mua
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(new Paragraph("BILL TO:", sectionHeadingFont));
            String customerName = (payment.getUser().getFirstName() != null ? payment.getUser().getFirstName() : "") + " " +
                    (payment.getUser().getLastName() != null ? payment.getUser().getLastName() : payment.getUser().getUsername());
            leftCell.addElement(new Paragraph("Customer: " + customerName, normalFont));
            leftCell.addElement(new Paragraph("Account: " + payment.getUser().getUsername(), normalFont));
            infoTable.addCell(leftCell);

            // Cột phải: Chi tiết hóa đơn ngân hàng
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.addElement(new Paragraph("INVOICE DETAILS:", sectionHeadingFont));
            rightCell.addElement(new Paragraph("Invoice ID: " + payment.getPaymentId().toString().substring(0, 8).toUpperCase(), boldFont));
            rightCell.addElement(new Paragraph("Gateway: " + payment.getGateway().name(), normalFont));
            if(payment.getGatewayTransactionId() != null) {
                rightCell.addElement(new Paragraph("Trans No: " + payment.getGatewayTransactionId(), normalFont));
            }
            rightCell.addElement(new Paragraph("Date: " + payment.getCreatedAt().toString(), normalFont));
            infoTable.addCell(rightCell);

            document.add(infoTable);

            PdfPTable itemTable = new PdfPTable(3);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new int[]{5, 3, 3});
            itemTable.setSpacingAfter(15);

            Color headerBg = new Color(245, 245, 247);

            PdfPCell h1 = new PdfPCell(new Phrase("Service Description", sectionHeadingFont));
            h1.setBackgroundColor(headerBg); h1.setPadding(8);

            PdfPCell h2 = new PdfPCell(new Phrase("Plan Duration", sectionHeadingFont));
            h2.setBackgroundColor(headerBg); h2.setPadding(8); h2.setHorizontalAlignment(Element.ALIGN_CENTER);

            PdfPCell h3 = new PdfPCell(new Phrase("Subtotal", sectionHeadingFont));
            h3.setBackgroundColor(headerBg); h3.setPadding(8); h3.setHorizontalAlignment(Element.ALIGN_RIGHT);

            itemTable.addCell(h1); itemTable.addCell(h2); itemTable.addCell(h3);

            // Đổ data động từ bản ghi thanh toán vào bảng dịch vụ
            String desc = payment.getOrderInfo() != null ? payment.getOrderInfo() : "Upgrade Account to Premium Plan";
            PdfPCell cellDesc = new PdfPCell(new Phrase(desc, normalFont));
            cellDesc.setPadding(8);
            itemTable.addCell(cellDesc);

            String duration = payment.getPlanType() != null ? payment.getPlanType().name() : "PREMIUM";
            PdfPCell cellDuration = new PdfPCell(new Phrase(duration, normalFont));
            cellDuration.setPadding(8); cellDuration.setHorizontalAlignment(Element.ALIGN_CENTER);
            itemTable.addCell(cellDuration);

            String price = payment.getAmount() + " " + payment.getCurrency().name();
            PdfPCell cellPrice = new PdfPCell(new Phrase(price, normalFont));
            cellPrice.setPadding(8); cellPrice.setHorizontalAlignment(Element.ALIGN_RIGHT);
            itemTable.addCell(cellPrice);

            document.add(itemTable);


            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(100);
            totalTable.setWidths(new int[]{7, 4});

            PdfPCell dummyCell = new PdfPCell();
            dummyCell.setBorder(Rectangle.NO_BORDER);
            totalTable.addCell(dummyCell);

            PdfPCell totalCell = new PdfPCell();
            totalCell.setPadding(10);
            totalCell.setBackgroundColor(new Color(253, 242, 242));

            Paragraph totalPara = new Paragraph("TOTAL PAID: " + price, totalFont);
            totalPara.setAlignment(Element.ALIGN_RIGHT);
            totalCell.addElement(totalPara);

            totalTable.addCell(totalCell);
            document.add(totalTable);

            Paragraph footer = new Paragraph("\n\nThank you for choosing FlySpeech! Premium features are now fully unlocked.", normalFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception ex) {
            System.out.println("Lỗi sinh PDF hóa đơn OpenPDF: " + ex.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}