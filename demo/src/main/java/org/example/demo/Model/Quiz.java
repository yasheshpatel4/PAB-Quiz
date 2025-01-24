package org.example.demo.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "quiz_table")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int Quizid;

    @Column(name = "quiz_subject")
    String QuizSubject;

    @Column(name = "quiz_sem")
    int QuizSem;

    @Column(name = "quiz_duration")
    int QuizDuration;

    @Column(name = "quiz_description")
    String QuizDescription;

    @ManyToOne
    @JoinColumn(name = "admin_email")
    private Admin admin_obj;

    public String getQuizSubject() {
        return QuizSubject;
    }

    public void setQuizSubject(String quizSubject) {
        QuizSubject = quizSubject;
    }

    public int getQuizSem() {
        return QuizSem;
    }

    public void setQuizSem(int quizSem) {
        QuizSem = quizSem;
    }

    public int getQuizDuration() {
        return QuizDuration;
    }

    public void setQuizDuration(int quizDuration) {
        QuizDuration = quizDuration;
    }

    public String getQuizDescription() {
        return QuizDescription;
    }

    public void setQuizDescription(String quizDescription) {
        QuizDescription = quizDescription;
    }

    public Admin getAdmin_obj() {
        return admin_obj;
    }

    public void setAdmin_obj(Admin admin_obj) {
        this.admin_obj = admin_obj;
    }

    @Override
    public String   toString() {
        return "Quiz{" +
                "Quizid=" + Quizid +
                ", QuizSubject='" + QuizSubject + '\'' +
                ", QuizSem=" + QuizSem +
                ", QuizDuration=" + QuizDuration +
                ", QuizDescription='" + QuizDescription + '\'' +
                ", admin_obj=" + admin_obj +
                '}';
    }
}
