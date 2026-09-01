package com.pharmacy.backend.service;

import com.pharmacy.backend.dto.RevenueSummaryDTO;
import com.pharmacy.backend.dto.SalesReportDTO;
import com.pharmacy.backend.entity.Sales;
import com.pharmacy.backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private SalesRepository salesRepository;

    public SalesReportDTO getSalesReport() {
        List<Sales> sales = salesRepository.findAll();

        double revenue = sales.stream()
                .mapToDouble(Sales::getTotalPrice)
                .sum();

        SalesReportDTO report = new SalesReportDTO();
        report.setSales(sales);
        report.setTotalRevenue(revenue);
        report.setTotalSales(sales.size());

        return report;
    }

    public RevenueSummaryDTO getRevenueSummary() {
        Map<String, Object> result = salesRepository.getRevenueSummaryRaw();

        Double today = result.get("today") != null ? ((Number) result.get("today")).doubleValue() : 0.0;
        Double thisWeek = result.get("this_week") != null ? ((Number) result.get("this_week")).doubleValue() : 0.0;
        Double thisMonth = result.get("this_month") != null ? ((Number) result.get("this_month")).doubleValue() : 0.0;
        Long totalTransactions = result.get("total_transactions") != null ? ((Number) result.get("total_transactions")).longValue() : 0L;

        return new RevenueSummaryDTO(today, thisWeek, thisMonth, totalTransactions);
    }
}