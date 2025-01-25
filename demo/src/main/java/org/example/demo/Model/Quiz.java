package org.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "quiz_table")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Quizid;

    @JsonProperty("QuizSubject")
    private String QuizSubject;


    @JsonProperty("QuizSem")
    private int QuizSem;


    @JsonProperty("QuizDuration")
    private int QuizDuration;


    @JsonProperty("QuizDescription")
    private String QuizDescription;

    @ManyToOne
    @JoinColumn(name = "admin_email")
    @JsonBackReference
    private Admin adminObj;

    public int getQuizid() {
        return Quizid;
    }

    public void setQuizid(int quizid) {
        Quizid = quizid;
    }

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

    public Admin getAdminObj() {
        return adminObj;
    }

    public void setAdminObj(Admin adminObj) {
        this.adminObj = adminObj;
    }

    @Override
    public String   toString() {
        return "Quiz{" +
                "Quizid=" + Quizid +
                ", QuizSubject='" + QuizSubject + '\'' +
                ", QuizSem=" + QuizSem +
                ", QuizDuration=" + QuizDuration +
                ", QuizDescription='" + QuizDescription + '\'' +
                ", admin_obj=" + adminObj +
                '}';
    }

}
