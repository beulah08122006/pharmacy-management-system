package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.Inventory;
import com.pharmacy.backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    // Add Inventory
    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // Get All Inventory
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // Get Inventory By ID
    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    // Update Inventory
    public Inventory updateInventory(Long id, Inventory inventory) {
        inventory.setId(id);
        return inventoryRepository.save(inventory);
    }

    // Delete Inventory
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
    // Get Low Stock Medicines
public List<Inventory> getLowStockMedicines() {
    return inventoryRepository.findLowStockMedicines();
}
}