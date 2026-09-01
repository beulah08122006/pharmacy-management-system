package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.Sales;
import com.pharmacy.backend.service.SalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin("*")
public class SalesController {

    @Autowired
    private SalesService salesService;

    // Add Sale
    @PostMapping
    public ResponseEntity<Sales> addSale(@RequestBody Sales sale) {
        return ResponseEntity.ok(salesService.saveSale(sale));
    }

    // Get All Sales
    @GetMapping
    public ResponseEntity<List<Sales>> getAllSales() {
        return ResponseEntity.ok(salesService.getAllSales());
    }

    // Get Sale By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSaleById(@PathVariable Long id) {
        return salesService.getSaleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete Sale
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSale(@PathVariable Long id) {
        salesService.deleteSale(id);
        return ResponseEntity.ok("Sale deleted successfully");
    }

    // Total Revenue
    @GetMapping("/revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(salesService.getTotalRevenue());
    }

    // Total Sales Count
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalSales() {
        return ResponseEntity.ok(salesService.getTotalSales());
    }
}