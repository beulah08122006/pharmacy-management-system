package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.Inventory;
import com.pharmacy.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin("*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // Add Inventory
    @PostMapping
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {

        System.out.println("========== POST /api/inventory REACHED ==========");

        System.out.println("Medicine ID : " +
                (inventory.getMedicine() != null
                        ? inventory.getMedicine().getId()
                        : "NULL"));

        System.out.println("Quantity : " + inventory.getQuantity());
        System.out.println("Minimum Stock : " + inventory.getMinimumStock());

        Inventory savedInventory = inventoryService.saveInventory(inventory);

        System.out.println("Inventory Saved Successfully");

        return ResponseEntity.ok(savedInventory);
    }

    // Get All Inventory
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    // Get Inventory By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getInventoryById(@PathVariable Long id) {
        return inventoryService.getInventoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Inventory
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventory) {

        return ResponseEntity.ok(
                inventoryService.updateInventory(id, inventory)
        );
    }

    // Delete Inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable Long id) {

        inventoryService.deleteInventory(id);

        return ResponseEntity.ok("Inventory deleted successfully");
    }
    // Get Low Stock Medicines
@GetMapping("/low-stock")
public ResponseEntity<List<Inventory>> getLowStockMedicines() {
    return ResponseEntity.ok(inventoryService.getLowStockMedicines());
}
}