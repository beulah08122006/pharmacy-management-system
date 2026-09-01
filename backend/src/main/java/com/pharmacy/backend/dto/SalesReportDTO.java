package com.pharmacy.backend.dto;

import com.pharmacy.backend.entity.Sales;
import java.util.List;

public class SalesReportDTO {

    private List<Sales> sales;
    private double totalRevenue;
    private long totalSales;

    public SalesReportDTO() {
    }

    public List<Sales> getSales() {
        return sales;
    }

    public void setSales(List<Sales> sales) {
        this.sales = sales;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(long totalSales) {
        this.totalSales = totalSales;
    }
}