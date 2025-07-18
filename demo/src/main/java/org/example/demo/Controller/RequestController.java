package org.example.demo.Controller;

import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.demo.Model.Admin;
import org.example.demo.Model.Question;
import org.example.demo.Model.Quiz;
import org.example.demo.Model.Student;
import org.example.demo.Repo.QuizRepository;
import org.example.demo.Repo.Repoadmin;
import org.example.demo.Services.SignUpservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<String> login(@RequestBody Admin admin) {
        Optional<Admin> loggedInUser = signUpservice.loginUser(admin.getEmail(), admin.getPassword());

        if (loggedInUser.isPresent()) {
            return ResponseEntity.ok("Login successful for " + loggedInUser.get().getEmail());
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/student/login")
    public ResponseEntity<String> login(@RequestBody Student student) {
        Optional<Student> loggedInUser = signUpservice.loginStudent(student.getEmail(),student.getStudentID());
        if (loggedInUser.isPresent()) {
            return ResponseEntity.ok("Login successful for " + loggedInUser.get().getEmail());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/admin/addstudentdata")
    public ResponseEntity<?> addStudentData(@RequestBody List<Student> students,@RequestParam String adminEmail) {
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
    public int getTotalStudents(@RequestParam String email) {
        return signUpservice.gettotalstudents(email);
    }

    @GetMapping("/admin/getallstudents")
    public ResponseEntity<List<Student>> getAllStudents(@RequestParam String email) {
        return signUpservice.getAllStudent(email);
    }

    @DeleteMapping("/admin/deletestudent/{id}")
    public ResponseEntity<String> deleteStudent(@RequestParam String email,@PathVariable String id) {
        boolean deleted = signUpservice.deleteStudent(email,id);
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
    public int getTotalQuiz(@RequestParam String email) {
        return signUpservice.getTotalQuiz(email);
    }

    @GetMapping("/admin/getallquiz")
    public ResponseEntity<List<Quiz>> getAllQuiz(@RequestParam String email) {

        return signUpservice.getAllQuiz(email);
    }

    @DeleteMapping("/admin/deletequiz/{id}")
    public ResponseEntity<String> deletequiz(@PathVariable int id) {
        boolean deleted = signUpservice.deletequiz(id);
        if (deleted) {
            return ResponseEntity.ok("Quiz deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Quiz not found");
        }
    }

    @PostMapping("/admin/addquestion")
    public ResponseEntity<String> addQuestion(@RequestBody List<Question> question,@RequestParam int quizid) {
        try{
            for(Question q : question) {
                String result = signUpservice.addQuestion(q,quizid);
                if(result.equals("Error: Question already exists!")) {
                    return ResponseEntity.status(400).body(result);
                }
            }
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
        return ResponseEntity.ok("Question added successfully");
    }

    @GetMapping("/admin/getallquestion")
    public ResponseEntity<List<Question>> getAllQuestion(@RequestParam int quizid) {
        return signUpservice.getallquestion(quizid);
    }

    @GetMapping("/admin/noofquestion/{quizid}")
    public ResponseEntity<Integer> getTotalQuestion(@PathVariable int quizid) {
        int ans =  signUpservice.getTotalQuestion(quizid);
        return ResponseEntity.ok(ans);
    }

    @PostMapping("/admin/upload/{quizid}")
    public ResponseEntity<String> upload(@PathVariable int quizid){

        String ans = signUpservice.uploadquiz(quizid);
        return ResponseEntity.ok(ans);
    }

    @DeleteMapping("/admin/deletequestion/{questionid}")
    public ResponseEntity<String> deleteQuestion(@PathVariable int questionid) {
        boolean deleted = signUpservice.deletequestion(questionid);
        if (deleted) {
            return ResponseEntity.ok("Quiz deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Quiz not found");
        }
    }

    @PostMapping("/admin/uploadquestion/{quizid}")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable int  quizid) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty. Please upload a valid file.");
        }

        String fileType = file.getContentType();
        if (fileType == null ||
                (!fileType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") &&
                        !fileType.equals("application/vnd.ms-excel"))) {
            return ResponseEntity.badRequest().body("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
        }

        try {
            signUpservice.saveQuestionToExcel(file, quizid);
            return ResponseEntity.ok("File uploaded successfully and processed.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }

    @PostMapping("/admin/aigenerate/{quizid}") // appended to base path
    public ResponseEntity<String> generateAigene(
            @PathVariable int quizid,
            @RequestParam int numQuestions,
            @RequestParam String description,
            @RequestParam String difficulty) {

        if (numQuestions < 15 || numQuestions > 30) {
            return ResponseEntity.badRequest().body("Number of questions must be between 15 and 30.");
        }

        if (description.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Description cannot be empty.");
        }

        return ResponseEntity.ok(
                signUpservice.generateQuestions(quizid, numQuestions, description, difficulty)
        );

    }

    @PatchMapping("/admin/updatestudent/{studentID}")
    public ResponseEntity<String> updateStudent(@PathVariable String studentID, @RequestBody Student updatedStudent) {
        return signUpservice.updateStudent(studentID, updatedStudent);
    }

}
