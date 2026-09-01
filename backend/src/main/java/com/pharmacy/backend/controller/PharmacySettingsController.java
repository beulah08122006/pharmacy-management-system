package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.PharmacySettings;
import com.pharmacy.backend.service.PharmacySettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pharmacy-settings")
@CrossOrigin("*")
public class PharmacySettingsController {

    @Autowired
    private PharmacySettingsService service;

    @GetMapping
    public PharmacySettings getSettings() {
        return service.getSettings();
    }

    @PutMapping
    public PharmacySettings updateSettings(@RequestBody PharmacySettings settings) {
        return service.updateSettings(settings);
    }
}