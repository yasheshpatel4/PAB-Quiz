package org.example.demo.Services;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

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

    public int getTotalQuiz(String email) {
        long ans = quizRepository.countByAdminEmail(email);
        int total = (int) ans;
        return total;
    }

    public ResponseEntity<List<Quiz>> getAllQuiz(String email) {
        List<Quiz> quizzes = quizRepository.findQuizzesByAdminEmail(email);
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

    public Optional<Student> loginStudent(String email, String studentID) {
        Student student = studentRepository.findByEmailAndStudentID(email, studentID);
        if (student == null) {
            return Optional.empty();
        }
        return Optional.of(student);
    }

    public String uploadquiz(int quizid) {
        Quiz q = quizRepository.findById(quizid).get();
        q.setAvailable(true);
        quizRepository.save(q);
        return "upload successfully!";
    }

    public void saveQuestionToExcel(MultipartFile file, int quizid) throws IOException {

        Quiz quiz = quizRepository.findById(quizid).orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Fetch existing questions for this quiz
        List<Question> existingQuestions = questionRepository.findByQuizId(quizid);
        Set<String> existingQuestionTexts = existingQuestions.stream()
                .map(Question::getQuestion)
                .collect(Collectors.toSet());

        // Parse Excel file and filter out duplicate questions
        List<Question> newQuestions = parseExcelFile(file, quiz, existingQuestionTexts);

        if (!newQuestions.isEmpty()) {
            questionRepository.saveAll(newQuestions);
        }
    }

    private List<Question> parseExcelFile(MultipartFile file, Quiz quiz, Set<String> existingQuestionTexts) throws IOException {
        List<Question> questions = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) { // Skip header row
                    rowNumber++;
                    continue;
                }

                String questionText = getCellValueAsString(currentRow.getCell(0));

                // Check if the question already exists
                if (existingQuestionTexts.contains(questionText)) {
                    continue; // Skip duplicate question
                }

                Question question = new Question();
                question.setQuestion(questionText);
                question.setAnswer(getCellValueAsString(currentRow.getCell(1)));
                question.setOption1(getCellValueAsString(currentRow.getCell(2)));
                question.setOption2(getCellValueAsString(currentRow.getCell(3)));
                question.setOption3(getCellValueAsString(currentRow.getCell(4)));
                question.setOption4(getCellValueAsString(currentRow.getCell(5)));
                question.setQuiz(quiz);

                questions.add(question);
            }
        }

        return questions;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    public boolean deletequestion(int questionid) {
        Question question = questionRepository.findById(questionid).get();
        if (question.getQuiz() == null) {
            return false;
        }
        questionRepository.delete(question);
        return true;
    }

}
