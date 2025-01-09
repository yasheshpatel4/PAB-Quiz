package org.example.demo.Controller;

import org.example.demo.Model.Admin;
import org.example.demo.Services.SignUpservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
@CrossOrigin
public class RequestController {
    @Autowired
    private SignUpservice signupService;

    @PostMapping("/signup")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
        try {
            Admin savedAdmin = signupService.registerAdmin(admin);
            return ResponseEntity.ok("Admin registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        var loggedInUser = signupService.loginUser(admin.getEmail(), admin.getPassword());
        if (loggedInUser.isPresent()) {
            return "Login successful for " + loggedInUser.get().getEmail();
        }
        return "Invalid credentials";
    }
}
