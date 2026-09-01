package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.Medicine;
import com.pharmacy.backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    // Add Medicine
    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    // Get All Medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // Get Medicine By ID
    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    // Update Medicine
    public Medicine updateMedicine(Long id, Medicine medicine) {
        medicine.setId(id);
        return medicineRepository.save(medicine);
    }

    // Delete Medicine
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    // Search Medicine by Name
    public List<Medicine> searchMedicine(String medicineName) {
        return medicineRepository.findByMedicineNameContainingIgnoreCase(medicineName);
    }
    public List<Medicine> getExpiringMedicines() {

    LocalDate next30Days = LocalDate.now().plusDays(30);

    return medicineRepository.findByExpiryDateBefore(next30Days);
}
}