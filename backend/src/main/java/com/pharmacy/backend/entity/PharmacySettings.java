package com.pharmacy.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pharmacy_settings")
public class PharmacySettings {

    @Id
    private Long id = 1L; // singleton row — always id 1

    private String pharmacyName;
    private String address;
    private String phone;
    private String email;
    private String gstNumber;
    private String licenseNumber;
    private String openingTime;
    private String closingTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPharmacyName() { return pharmacyName; }
    public void setPharmacyName(String pharmacyName) { this.pharmacyName = pharmacyName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getOpeningTime() { return openingTime; }
    public void setOpeningTime(String openingTime) { this.openingTime = openingTime; }
    public String getClosingTime() { return closingTime; }
    public void setClosingTime(String closingTime) { this.closingTime = closingTime; }
}