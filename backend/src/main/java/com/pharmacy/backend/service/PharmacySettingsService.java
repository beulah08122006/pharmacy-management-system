package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.PharmacySettings;
import com.pharmacy.backend.repository.PharmacySettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PharmacySettingsService {

    @Autowired
    private PharmacySettingsRepository repository;

    public PharmacySettings getSettings() {
        return repository.findById(1L).orElseGet(() -> {
            PharmacySettings defaults = new PharmacySettings();
            defaults.setId(1L);
            defaults.setPharmacyName("PharmaCare");
            defaults.setAddress("");
            defaults.setPhone("");
            defaults.setEmail("");
            defaults.setGstNumber("");
            defaults.setLicenseNumber("");
            defaults.setOpeningTime("09:00");
            defaults.setClosingTime("21:00");
            return repository.save(defaults);
        });
    }

    public PharmacySettings updateSettings(PharmacySettings updated) {
        updated.setId(1L);
        return repository.save(updated);
    }
}