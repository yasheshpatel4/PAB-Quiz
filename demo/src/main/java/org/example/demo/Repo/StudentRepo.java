package org.example.demo.Repo;

import org.example.demo.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo extends JpaRepository<Student, String> {
    /// find by all value because all value is unique
    List<Student> findByEmailAndStudentIDAndRollNumber(String email, String studentID, String rollNumber);
    Student findByEmailAndStudentID(String email, String studentID);
    Student findByEmail(String email);
}
