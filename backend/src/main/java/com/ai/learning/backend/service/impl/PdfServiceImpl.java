package com.ai.learning.backend.service.impl;
import com.ai.learning.backend.service.PdfService;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

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
}