package org.example.demo.Repo;

import org.example.demo.Model.Admin;
import org.example.demo.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Repoadmin extends JpaRepository<Admin, String> {
    Admin findByEmail(String email);
    @Query("SELECT a FROM Admin a JOIN a.students s WHERE s.studentID = :studentId")
    List<Admin> findByStudentsContaining(@Param("studentId") String studentId);

}
