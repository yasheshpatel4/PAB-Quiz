package org.example.demo.Services;

import org.example.demo.Model.Admin;
import org.example.demo.Model.Student;
import org.example.demo.Repo.Repoadmin;
import org.example.demo.Repo.StudentRepo;
import org.hibernate.query.Query;
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

    public String addStudentData(Student s) {
        List<Student> students = studentRepository.findByEmailAndStudentIDAndRollNumber(s.getEmail(), s.getStudentID(), s.getRollNumber());
        if (!students.isEmpty()) {
            return "Error: Student already exists!";
        }
        studentRepository.save(s);
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

}
