package org.example.demo.Repo;

import org.example.demo.Model.Question;
import org.example.demo.Model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepo extends JpaRepository<Question, Integer> {

    List<Question> findByQuiz(Quiz quiz);
}
