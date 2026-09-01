package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.User;
import com.pharmacy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updated) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        existing.setFullName(updated.getFullName());
        existing.setRole(updated.getRole());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setSalary(updated.getSalary());
        existing.setShift(updated.getShift());
        existing.setEmergencyContact(updated.getEmergencyContact());
        existing.setNotes(updated.getNotes());
        existing.setActive(updated.isActive());
        return userRepository.save(existing);
    }

    // Admin-style reset — no current-password check (used from Employees module)
    public void resetPassword(Long id, String newPassword) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        existing.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(existing);
    }

    // Self-service change — verifies current password first (used from Settings)
    public void changePassword(Long id, String currentPassword, String newPassword) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, existing.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        existing.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(existing);
    }
}