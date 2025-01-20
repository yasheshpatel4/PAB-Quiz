package org.example.demo.Controller;

import org.example.demo.Model.Admin;
import org.example.demo.Model.Student;
import org.example.demo.Services.SignUpservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/auth")
@RestController
@CrossOrigin
public class RequestController {

    @Autowired
    private SignUpservice signUpservice;

    @PostMapping("/admin/signup")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
        try {
            String result = signUpservice.registerAdmin(admin);
            if (result.equals("Error: Email already exists!")) {
                return ResponseEntity.status(400).body(result);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<String> login(@RequestBody Admin admin) {
        Optional<Admin> loggedInUser = signUpservice.loginUser(admin.getEmail(), admin.getPassword());

        if (loggedInUser.isPresent()) {
            return ResponseEntity.ok("Login successful for " + loggedInUser.get().getEmail());
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/admin/addstudentdata")
    public ResponseEntity<String> addStudentData(@RequestBody List<Student> students) {
        try {
            for (Student student : students) {
                String result = signUpservice.addStudentData(student);
                if (result.equals("Error: Email already exists!")) {
                    return ResponseEntity.status(400).body(result);
                }
            }
            return ResponseEntity.ok("All students added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/admin/noofstudents")
    public int getTotalStudents() {
        return signUpservice.gettotalstudents();
    }

    @GetMapping("/admin/getallstudents")
    public ResponseEntity<List<Student>> getAllStudents() {
        return signUpservice.getAllStudent();
    }

    @DeleteMapping("/admin/deletestudent/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable String id) {
        System.out.println("Received delete request for ID: " + id);
        boolean deleted = signUpservice.deleteStudent(id);
        if (deleted) {
            return ResponseEntity.ok("Student deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Student not found");
        }
    }


}
