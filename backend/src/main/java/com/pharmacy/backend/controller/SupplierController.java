package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.Supplier;
import com.pharmacy.backend.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin("*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;


    // Add supplier
    @PostMapping
    public ResponseEntity<Supplier> addSupplier(
            @RequestBody Supplier supplier) {

        return ResponseEntity.ok(
                supplierService.addSupplier(supplier)
        );
    }


    // Get all suppliers
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {

        return ResponseEntity.ok(
                supplierService.getAllSuppliers()
        );
    }


    // Get supplier by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierById(
            @PathVariable Long id) {

        return supplierService.getSupplierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // Update supplier
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier) {

        return ResponseEntity.ok(
                supplierService.updateSupplier(id, supplier)
        );
    }


    // Delete supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(
            @PathVariable Long id) {

        supplierService.deleteSupplier(id);

        return ResponseEntity.ok(
                "Supplier deleted successfully"
        );
    }
    // Search Supplier
@GetMapping("/search")
public List<Supplier> searchSupplier(@RequestParam String name) {
    return supplierService.searchSupplier(name);
}
}
