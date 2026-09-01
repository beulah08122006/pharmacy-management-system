package com.pharmacy.backend.repository;

import com.pharmacy.backend.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findTop10ByOrderByMovedAtDesc();
}