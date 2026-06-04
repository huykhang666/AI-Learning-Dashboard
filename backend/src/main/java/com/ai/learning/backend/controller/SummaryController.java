package com.ai.learning.backend.controller;

import com.ai.learning.backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.Map;


@RestController
@RequestMapping("/api/summaries")
public class SummaryController {

    @Autowired
    private PdfService pdfService;
    @PostMapping("/{id}/export-pdf")
    public ResponseEntity<InputStreamResource> exportPdf(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) { // Hứng cục dữ liệu Frontend gửi lên
        String tieuDe = payload.get("title");
        String noiDung = payload.get("summary");
        ByteArrayInputStream pdfStream = pdfService.exportSummaryToPdf(tieuDe, noiDung);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=tom-tat-bai-" + id + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }
}