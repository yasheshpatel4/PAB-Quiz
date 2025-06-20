package org.example.demo.Controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.Model.Question;
import org.example.demo.Model.Quiz;
import org.example.demo.Model.QuizSubmission;
import org.example.demo.Services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam String adminEmail) {

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

            studentService.saveStudentsFromExcel(file, adminEmail);

            return ResponseEntity.ok("File uploaded successfully and processed.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/allquiz")
    public ResponseEntity<List<Quiz>> getQuizzes(@RequestParam String studentEmail, @RequestParam String studentID) {
        List<Quiz> quizzes = studentService.getallquiz(studentEmail, studentID);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/getquestion")
    public List<Question> getQuestions(@RequestParam int quizId) {
        return studentService.getallquestion(quizId);
    }

    @PostMapping("/submitQuiz")
    public ResponseEntity<String> submitQuiz(@RequestParam int quizId,
                                             @RequestParam String studentEmail,
                                             @RequestBody Map<Integer,String> answers,
                                             @RequestParam Boolean tabViolation
    ) {
        studentService.submitQuiz(quizId,studentEmail,answers,tabViolation);
        return ResponseEntity.ok("Quiz submitted successfully");
    }

    @GetMapping("/completedquiz")
    public ResponseEntity<List<String>> completedQuiz(@RequestParam String studentEmail, @RequestParam String studentID) {
        System.out.println(studentEmail + " " + studentID);
        List<String> list = studentService.completedquiz(studentEmail, studentID);
        return ResponseEntity.ok(list);
    }
}