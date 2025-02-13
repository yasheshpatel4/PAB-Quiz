package org.example.demo.Repo;


import org.example.demo.Model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {

    @Query("SELECT q FROM Quiz q WHERE q.adminObj.email = :email")
    List<Quiz> findQuizzesByAdminEmail(@Param("email") String email);

    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.adminObj.email = :email")
    long countByAdminEmail(@Param("email") String email);

    @Query("SELECT q FROM Quiz q WHERE q.isAvailable = true AND q.QuizSem= :sem")
    List<Quiz> findbyquery(@Param("sem") int sem);

}