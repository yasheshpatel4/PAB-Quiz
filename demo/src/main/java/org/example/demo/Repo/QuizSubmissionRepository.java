package org.example.demo.Repo;

import jakarta.transaction.Transactional;
import org.example.demo.Model.QuizSubmission;
import org.example.demo.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Integer> {

    @Query("SELECT qs.quiz.Quizid FROM QuizSubmission qs WHERE qs.student = :student")
    List<Integer> findSubmittedQuizIds(@Param("student") Student student);

    @Query("SELECT qqs.quiz.QuizSubject, qqs.quiz.QuizDescription, qqs.score FROM QuizSubmission qqs WHERE qqs.student = :student")
    List<Object[]> findQuizDetailsByStudent(@Param("student") Student student);

    @Modifying
    @Query("DELETE FROM QuizSubmission qs WHERE qs.quiz.Quizid = :quizId")
    @Transactional
    void deleteByQuizId(@Param("quizId") int quizId);

}
