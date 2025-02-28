package org.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "admintable")
public class Admin {

    @Id
    @Column(name = "admin_email")
    private String email;

    @Column(name = "admin_name")
    private String name;

    @Column(name = "admin_pass")
    private String password;

    @ManyToMany
    @JoinTable(name = "admin_student", joinColumns = @JoinColumn(name = "admin_email"), inverseJoinColumns = @JoinColumn(name = "student_id"))
    @JsonIgnore
    private List<Student> students;

    public void addStudent(Student student) {
        students.add(student);
        student.getAdmins().add(this); // Maintain bidirectional reference
    }

    public void removeStudent(Student student) {
        students.remove(student);
        student.getAdmins().remove(this); // Maintain bidirectional reference
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    @OneToMany(mappedBy = "adminObj" , cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Quiz> quizzes;

    public List<Quiz> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = quizzes;
    }



}