package org.example.demo.Repo;

import org.example.demo.Model.QuizSubmission;
import org.example.demo.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Integer> {

    @Query("SELECT qs.quiz.Quizid FROM QuizSubmission qs WHERE qs.student = :student")
    List<Integer> findSubmittedQuizIds(@Param("student") Student student);

    @Query("SELECT qqs.quiz.QuizSubject, qqs.quiz.QuizDescription, qqs.score FROM QuizSubmission qqs WHERE qqs.student = :student")
    List<Object[]> findQuizDetailsByStudent(@Param("student") Student student);

}
