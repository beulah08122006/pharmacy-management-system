package com.pharmacy.backend.controller;

import com.pharmacy.backend.dto.LoginResponse;
import com.pharmacy.backend.entity.User;
import com.pharmacy.backend.security.JwtService;
import com.pharmacy.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        Optional<User> user = userService.getUserByEmail(loginUser.getEmail());

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

       System.out.println("Entered Password: " + loginUser.getPassword());
System.out.println("Stored Hash: " + user.get().getPassword());

boolean match = passwordEncoder.matches(
        loginUser.getPassword(),
        user.get().getPassword()
);

System.out.println("Password Match = " + match);

if (!match) {
    return ResponseEntity.badRequest().body("Invalid Password");
}
        // Generate JWT Token
        String token = jwtService.generateToken(user.get().getEmail());

        LoginResponse response = new LoginResponse(
                user.get().getId(),
                user.get().getFullName(),
                user.get().getEmail(),
                user.get().getRole().name(),
                token,
                "Login Successful"
        );

        return ResponseEntity.ok(response);
    }
}