package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.Customer;
import com.pharmacy.backend.entity.Medicine;
import com.pharmacy.backend.entity.Sales;
import com.pharmacy.backend.repository.CustomerRepository;
import com.pharmacy.backend.repository.MedicineRepository;
import com.pharmacy.backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SalesService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Save Sale
    public Sales saveSale(Sales sale) {

        // Fetch Customer
        Customer customer = customerRepository.findById(
                sale.getCustomer().getId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        // Fetch Medicine
        Medicine medicine = medicineRepository.findById(
                sale.getMedicine().getId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        // Check Stock
        if (medicine.getQuantity() < sale.getQuantity()) {
            throw new RuntimeException("Insufficient stock available");
        }

        // Calculate Total Price
        double totalPrice = medicine.getPrice() * sale.getQuantity();
        sale.setTotalPrice(totalPrice);

        // Set Sale Date
        sale.setSaleDate(LocalDateTime.now());

        // Reduce Medicine Stock
        medicine.setQuantity(
                medicine.getQuantity() - sale.getQuantity());

        // Save Updated Medicine
        medicineRepository.save(medicine);

        // Attach Customer & Medicine
        sale.setCustomer(customer);
        sale.setMedicine(medicine);

        // Save Sale
        return salesRepository.save(sale);
    }

    // Get All Sales
    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    // Get Sale By ID
    public Optional<Sales> getSaleById(Long id) {
        return salesRepository.findById(id);
    }

    // Delete Sale
    public void deleteSale(Long id) {
        salesRepository.deleteById(id);
    }

    // Total Revenue
    public double getTotalRevenue() {
        return salesRepository.findAll()
                .stream()
                .mapToDouble(Sales::getTotalPrice)
                .sum();
    }

    // Total Sales Count
    public long getTotalSales() {
        return salesRepository.count();
    }
}