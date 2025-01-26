package org.example.demo.Services;

import org.example.demo.Model.Admin;
import org.example.demo.Model.Question;
import org.example.demo.Model.Quiz;
import org.example.demo.Model.Student;
import org.example.demo.Repo.QuestionRepo;
import org.example.demo.Repo.QuizRepository;
import org.example.demo.Repo.Repoadmin;
import org.example.demo.Repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SignUpservice {

    @Autowired
    private Repoadmin adminRepository;

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepo questionRepository;

    public String registerAdmin(Admin admin){

        Admin existingAdmin = adminRepository.findByEmail(admin.getEmail());

        if (existingAdmin != null) {
            return "Error: Email already exists!";
        }

        adminRepository.save(admin);
        return "Admin registered successfully!";
    }

    public Optional<Admin> loginUser(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);

        if (admin != null && admin.getPassword().equals(password)) {
            return Optional.of(admin);
        }
        return Optional.empty();
    }

    public String addStudentData(Student student, String adminEmail) {
        Admin admin = adminRepository.findByEmail(adminEmail);
        if (admin == null) {
            return "Error: Admin not found!";
        }

        List<Student> existingStudents = studentRepository.findByEmailAndStudentIDAndRollNumber(
                student.getEmail(), student.getStudentID(), student.getRollNumber());
        if (!existingStudents.isEmpty()) {
            return "Error: Student already exists!";
        }

        // Associate the student with the admin
        student.setAdmin(admin);
        studentRepository.save(student);

        return "Student added successfully!";
    }

    public int gettotalstudents() {
        long ans = studentRepository.count();
        int total = (int) ans;
        return total;
    }

    public ResponseEntity<List<Student>> getAllStudent() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(students);
    }

    public boolean deleteStudent(String id) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isPresent()) {
            studentRepository.delete(studentOptional.get());
            return true;
        } else {
            return false;
        }
    }

    public String addQuiz(Quiz quiz , String adminEmail) {
        Admin admin = adminRepository.findByEmail(adminEmail);
        if (admin == null) {
            return "Error: Admin not found!";
        }
        quiz.setAdminObj(admin);
        quizRepository.save(quiz);

        return "Quiz added successfully!";
    }

    public int getTotalQuiz() {
        long ans = quizRepository.count();
        int total = (int) ans;
        return total;
    }

    public ResponseEntity<List<Quiz>> getAllQuiz() {
        List<Quiz> quizzes = quizRepository.findAll();
        if (quizzes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(quizzes);
    }

    public boolean deletequiz(int id) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isPresent()) {
            quizRepository.delete(quizOptional.get());
            return true;
        } else {
            return false;
        }
    }

    public String addQuestion(Question question, int quizId) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (optionalQuiz.isEmpty()) {
            return "Error: Quiz not found!";
        }

        Quiz quiz = optionalQuiz.get();
        List<Question> existingQuestions = questionRepository.findByQuiz(quiz);
        for (Question existingQuestion : existingQuestions) {
            if (existingQuestion.getQuestion().equalsIgnoreCase(question.getQuestion())) {
                return "Error: Question already exists!";
            }
        }

        question.setQuiz(quiz);
        questionRepository.save(question);
        return "Question added successfully!";
    }

    public ResponseEntity<List<Question>> getallquestion(int quizid) {

        Quiz quiz = quizRepository.findById(quizid).get();
        List<Question> questions = questionRepository.findByQuiz(quiz);

        if (questions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(questions);
    }

    public int getTotalQuestion(int quizid) {
        Quiz quiz = quizRepository.findById(quizid).get();
        List<Question> questions = questionRepository.findByQuiz(quiz);
        return questions.size();
    }

}
