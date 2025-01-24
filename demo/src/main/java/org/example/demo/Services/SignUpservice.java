package org.example.demo.Services;

import org.example.demo.Model.Admin;
import org.example.demo.Model.Quiz;
import org.example.demo.Model.Student;
import org.example.demo.Repo.QuizRepository;
import org.example.demo.Repo.Repoadmin;
import org.example.demo.Repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SignUpservice {

    @Autowired
    private Repoadmin adminRepository;

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private QuizRepository quizRepository;

    public String registerAdmin(Admin admin){

        Admin existingAdmin = adminRepository.findByEmail(admin.getEmail());

        if (existingAdmin != null) {
            return "Error: Email already exists!";
        }

        adminRepository.save(admin);
        return "Admin registered successfully!";
    }

    public Optional<Admin> loginUser(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);

        if (admin != null && admin.getPassword().equals(password)) {
            return Optional.of(admin);
        }
        return Optional.empty();
    }

    public String addStudentData(Student student, String adminEmail) {
        Admin admin = adminRepository.findByEmail(adminEmail);
        if (admin == null) {
            return "Error: Admin not found!";
        }

        List<Student> existingStudents = studentRepository.findByEmailAndStudentIDAndRollNumber(
                student.getEmail(), student.getStudentID(), student.getRollNumber());
        if (!existingStudents.isEmpty()) {
            return "Error: Student already exists!";
        }

        // Associate the student with the admin
        student.setAdmin(admin);
        studentRepository.save(student);

        return "Student added successfully!";
    }

    public int gettotalstudents() {
        long ans = studentRepository.count();
        int total = (int) ans;
        return total;
    }

    public ResponseEntity<List<Student>> getAllStudent() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(students);
    }

    public boolean deleteStudent(String id) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isPresent()) {
            studentRepository.delete(studentOptional.get());
            return true;
        } else {
            return false;
        }
    }

    public String addQuiz(Quiz quiz , String adminEmail) {
        System.out.printf("Adding Quiz %s\n", quiz);
        Admin admin = adminRepository.findByEmail(adminEmail);
        if (admin == null) {
            return "Error: Admin not found!";
        }
        quiz.setAdmin_obj(admin);
        quizRepository.save(quiz);

        return "Quiz added successfully!";
    }

    public int getTotalQuiz() {
        long ans = quizRepository.count();
        int total = (int) ans;
        return total;
    }
}
