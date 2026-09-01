package com.pharmacy.backend.controller;

import com.pharmacy.backend.dto.RevenueSummaryDTO;
import com.pharmacy.backend.dto.SalesReportDTO;
import com.pharmacy.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/sales")
    public SalesReportDTO getSalesReport() {
        return reportService.getSalesReport();
    }

    @GetMapping("/revenue-summary")
    public RevenueSummaryDTO getRevenueSummary() {
        return reportService.getRevenueSummary();
    }
}