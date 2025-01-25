package org.example.demo.Controller;

import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.demo.Model.Admin;
import org.example.demo.Model.Quiz;
import org.example.demo.Model.Student;
import org.example.demo.Repo.QuizRepository;
import org.example.demo.Repo.Repoadmin;
import org.example.demo.Services.SignUpservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

@RequestMapping("/auth")
@RestController
@CrossOrigin
public class RequestController {

    @Autowired
    private SignUpservice signUpservice;

    @PostMapping("/admin/signup")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin, HttpServletRequest request) {

        request.getSession().setAttribute("admin", admin);

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
    public ResponseEntity<String> login(@RequestBody Admin admin, HttpSession session) {
        Optional<Admin> loggedInUser = signUpservice.loginUser(admin.getEmail(), admin.getPassword());

        if (loggedInUser.isPresent()) {

            session.setAttribute("adminEmail", loggedInUser.get().getEmail());
            return ResponseEntity.ok("Login successful for " + loggedInUser.get().getEmail());
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/admin/addstudentdata")
    public ResponseEntity<?> addStudentData(@RequestBody List<Student> students,@RequestParam String adminEmail) {

        System.out.printf("addStudentData" + students);
        List<String> errors = new ArrayList<>();

        if (adminEmail == null || adminEmail.isEmpty()) {
            return ResponseEntity.status(400).body("Admin email is missing.");
        }

        try {
            for (Student student : students) {
                String result = signUpservice.addStudentData(student, adminEmail);
                if (result.startsWith("Error:")) {
                    errors.add("Student " + student.getEmail() + ": " + result);
                }
            }

            if (!errors.isEmpty()) {
                return ResponseEntity.status(400).body(errors);
            }
            return ResponseEntity.ok("All students added successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
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

    @PostMapping("/admin/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/admin/createquiz")
    public ResponseEntity<String> createQuiz(@RequestBody Quiz quiz, @RequestParam String adminEmail) {

       String result = signUpservice.addQuiz(quiz, adminEmail);
       if(result.equals("Error: Email already exists!")) {
           return ResponseEntity.status(400).body(result);
       }
       return ResponseEntity.ok("Quiz created successfully");
    }

    @GetMapping("/admin/noofquiz")
    public int getTotalQuiz() {
        return signUpservice.getTotalQuiz();
    }

    @GetMapping("/admin/getallquiz")
    public ResponseEntity<List<Quiz>> getAllQuiz() {
        return signUpservice.getAllQuiz();
    }

    @DeleteMapping("/admin/deletequiz/{id}")
    public ResponseEntity<String> deletequiz(@PathVariable int id) {
        System.out.println("Received delete request for ID: " + id);
        boolean deleted = signUpservice.deletequiz(id);
        if (deleted) {
            return ResponseEntity.ok("Quiz deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Quiz not found");
        }
    }

}