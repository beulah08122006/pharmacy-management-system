package com.pharmacy.backend.repository;

import com.pharmacy.backend.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Long> {

    @Query(value = "SELECT " +
           "(SELECT COALESCE(SUM(total_price), 0) FROM sales WHERE DATE(sale_date) = CURDATE()) AS today, " +
           "(SELECT COALESCE(SUM(total_price), 0) FROM sales WHERE YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)) AS this_week, " +
           "(SELECT COALESCE(SUM(total_price), 0) FROM sales WHERE MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE())) AS this_month, " +
           "(SELECT COUNT(*) FROM sales) AS total_transactions", 
           nativeQuery = true)
    Map<String, Object> getRevenueSummaryRaw();
}