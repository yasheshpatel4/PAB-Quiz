package org.example.demo.Repo;

import org.example.demo.Model.Admin;
import org.example.demo.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Repoadmin extends JpaRepository<Admin, String> {
    Admin findByEmail(String email);
}
