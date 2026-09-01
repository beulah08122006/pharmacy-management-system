package com.pharmacy.backend.repository;

import com.pharmacy.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("""
           SELECT i
           FROM Inventory i
           WHERE i.quantity <= i.minimumStock
           """)
    List<Inventory> findLowStockMedicines();

    @Query("""
           SELECT COUNT(i)
           FROM Inventory i
           WHERE i.quantity <= i.minimumStock
           """)
    long countLowStockMedicines();
}