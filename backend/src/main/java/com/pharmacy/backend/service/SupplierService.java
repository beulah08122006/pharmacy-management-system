package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.Supplier;
import com.pharmacy.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;


    // Add new supplier
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }


    // Get all suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }


    // Get supplier by id
    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }


    // Update supplier
    public Supplier updateSupplier(Long id, Supplier supplier) {

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        existingSupplier.setSupplierName(supplier.getSupplierName());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setPhone(supplier.getPhone());
        existingSupplier.setCompanyName(supplier.getCompanyName());
        existingSupplier.setAddress(supplier.getAddress());

        return supplierRepository.save(existingSupplier);
    }


    // Delete supplier
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
    // Search Supplier
public List<Supplier> searchSupplier(String supplierName) {
    return supplierRepository.findBySupplierNameContainingIgnoreCase(supplierName);
}
}