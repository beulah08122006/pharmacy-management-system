package com.pharmacy.backend.repository;

import com.pharmacy.backend.entity.PharmacySettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PharmacySettingsRepository extends JpaRepository<PharmacySettings, Long> {
}