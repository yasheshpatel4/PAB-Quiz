package org.example.demo.Repo;

import org.example.demo.Model.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Integer> {
}
