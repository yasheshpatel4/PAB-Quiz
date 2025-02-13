package org.example.demo.Services;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.Model.*;
import org.example.demo.Repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class StudentService {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private Repoadmin adminRepo;

    @Autowired
    private QuizRepository quizRepo;

    @Autowired
    private QuestionRepo questionRepo;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepo;

    public void saveStudentsFromExcel(MultipartFile file, String adminEmail) throws IOException {
        // Validate admin existence
        Admin admin = adminRepo.findByEmail(adminEmail);

        // Parse Excel file and associate students with the admin
        List<Student> students = parseExcelFile(file, admin);
        studentRepo.saveAll(students);
    }

    private List<Student> parseExcelFile(MultipartFile file, Admin admin) throws IOException {
        List<Student> students = new ArrayList<>();

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

                Student student = new Student();
                student.setStudentID(getCellValueAsString(currentRow.getCell(0)));
                student.setName(getCellValueAsString(currentRow.getCell(1)));
                student.setEmail(getCellValueAsString(currentRow.getCell(2)));
                student.setRollNumber(getCellValueAsString(currentRow.getCell(3)));
                student.setSem(getCellValueAsString(currentRow.getCell(4)));
                student.setAdmin(admin); // Associate student with admin

                students.add(student);
            }
        }

        return students;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return "";
        }
    }

    public List<Quiz> getallquiz(String studentEmail, String studentID) {

        Student s = studentRepo.findByEmailAndStudentID(studentEmail, studentID);
        String ss = s.getSem();
        int sem = Integer.parseInt(ss);
        List<Quiz> ans = quizRepo.findbyquery(sem);
        return ans;
    }

    public List<Question> getallquestion(int quizId) {
        Quiz q = quizRepo.findById(quizId).get();
        List<Question> list = questionRepo.findByQuiz(q);
        return list;
    }

    public ResponseEntity<?> submitQuiz(int quizId, String studentEmail, Map<Integer, String> answers, boolean tabViolation) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElse(null);

        if (quiz == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Quiz not found with ID: " + quizId));
        }

        Student student = studentRepo.findByEmail(studentEmail);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found with email: " + studentEmail));
        }

        // Default score
        int score = 0;

        if(tabViolation) {
            QuizSubmission quizSubmission = new QuizSubmission();
            quizSubmission.setQuiz(quiz);
            quizSubmission.setStudent(student);
            quizSubmission.setScore(score);
            quizSubmission.setTabViolation(true);
            quizSubmissionRepo.save(quizSubmission);
        }

        if (!tabViolation) { // Only evaluate answers if no tab violation
            for (Question question : quiz.getQuestions()) {
                String correctAnswer = question.getAnswer();
                String selectedAnswer = answers.getOrDefault(question.getQuestionid(), "");

                if (correctAnswer != null && correctAnswer.equalsIgnoreCase(selectedAnswer)) {
                    score += 1;
                }
            }

            // Save only if no tab violation
            QuizSubmission submission = new QuizSubmission();
            submission.setQuiz(quiz);
            submission.setStudent(student);
            submission.setAnswers(answers);
            submission.setScore(score);
            submission.setTabViolation(false); // Ensure it's false only when user hasn't switched tabs
            quizSubmissionRepo.save(submission);

            return ResponseEntity.ok(Map.of(
                    "message", "Quiz submitted successfully!",
                    "score", score
            ));
        }

        // Tab violation detected, return response instead of exception
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "❌ Cheating detected! Score is zero."));
    }

}
