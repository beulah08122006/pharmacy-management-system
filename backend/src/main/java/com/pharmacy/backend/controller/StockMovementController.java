package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.StockMovement;
import com.pharmacy.backend.repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@CrossOrigin("*")
public class StockMovementController {

    @Autowired
    private StockMovementRepository repository;

    @GetMapping
    public List<StockMovement> getRecent() {
        return repository.findTop10ByOrderByMovedAtDesc();
    }
}