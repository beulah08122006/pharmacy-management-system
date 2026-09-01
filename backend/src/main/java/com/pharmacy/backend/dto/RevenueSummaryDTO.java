package com.pharmacy.backend.dto;

public class RevenueSummaryDTO {
    private Double today;
    private Double thisWeek;
    private Double thisMonth;
    private Long totalTransactions;

    public RevenueSummaryDTO(Double today, Double thisWeek, Double thisMonth, Long totalTransactions) {
        this.today = today;
        this.thisWeek = thisWeek;
        this.thisMonth = thisMonth;
        this.totalTransactions = totalTransactions;
    }

    public Double getToday() { return today; }
    public Double getThisWeek() { return thisWeek; }
    public Double getThisMonth() { return thisMonth; }
    public Long getTotalTransactions() { return totalTransactions; }
}