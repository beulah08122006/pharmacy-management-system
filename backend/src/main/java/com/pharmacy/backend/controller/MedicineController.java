package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.Medicine;
import com.pharmacy.backend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin("*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    // Add Medicine
    @PostMapping
public Medicine addMedicine(@jakarta.validation.Valid @RequestBody Medicine medicine) {
    return medicineService.saveMedicine(medicine);
}

    // Get All Medicines
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    // Get Medicine By ID
    @GetMapping("/{id}")
    public Optional<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    // Update Medicine
    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id,
                                   @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine);
    }

    // Delete Medicine
    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return "Medicine deleted successfully";
    }

    // Search Medicine by Name
    @GetMapping("/search")
    public List<Medicine> searchMedicine(@RequestParam String name) {
        return medicineService.searchMedicine(name);
    }
    // Get Expiring Medicines
@GetMapping("/expiring")
public List<Medicine> getExpiringMedicines() {
    return medicineService.getExpiringMedicines();
}
}