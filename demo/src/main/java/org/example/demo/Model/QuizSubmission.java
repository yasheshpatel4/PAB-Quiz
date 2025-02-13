package org.example.demo.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Entity
@Table(name = "quiz_submission")
@Getter
@Setter
public class QuizSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int submissionId;

    @ManyToOne
    @JoinColumn(name = "quizid", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "studentID", nullable = false)
    private Student student;

    @ElementCollection
    @CollectionTable(name = "quiz_submission_answers", joinColumns = @JoinColumn(name = "submission_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "selected_answer")
    private Map<Integer, String> answers;

    @Column(name = "score")
    private int score;

    @Column(name = "tab_violation")
    private boolean tabViolation;

    public int getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(int submissionId) {
        this.submissionId = submissionId;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Map<Integer, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Integer, String> answers) {
        this.answers = answers;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public boolean isTabViolation() {
        return tabViolation;
    }

    public void setTabViolation(boolean tabViolation) {
        this.tabViolation = tabViolation;
    }
}
