package org.example.demo.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.Model.Admin;
import org.example.demo.Model.Question;
import org.example.demo.Model.Quiz;
import org.example.demo.Model.Student;
import org.example.demo.Repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@PropertySource("classpath:application-key.properties")
public class SignUpservice {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private Repoadmin adminRepository;

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepo questionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

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

        // Check if the student already exists
        Student existingStudent = studentRepository.findByEmail(student.getEmail()); // Assuming email is unique
        if (existingStudent != null) {
            student = existingStudent; // Use existing student instead of creating a new one
        } else {
            student.setAdmins(new ArrayList<>()); // Initialize if null
            student = studentRepository.save(student); // Save only if new
        }

        // Establish Many-to-Many relationship
        if (!admin.getStudents().contains(student)) { // Avoid duplicate relationships
            admin.getStudents().add(student);
            student.getAdmins().add(admin);
        }

        // Save the relationship
        adminRepository.save(admin);

        return "Student added successfully!";
    }

    public int gettotalstudents(String adminEmail) {
        return (int) studentRepository.countStudentsByAdminEmail(adminEmail);
    }

    public ResponseEntity<List<Student>> getAllStudent(String adminEmail) {
        List<Student> students = studentRepository.findStudentsByAdminEmail(adminEmail);

        if (students.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(students);
    }

    public boolean deleteStudent(String adminEmail, String studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();

            // Find the admin who is trying to delete
            Optional<Admin> adminOptional = adminRepository.findById(adminEmail);

            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();

                // Remove student from admin's list
                if (admin.getStudents().contains(student)) {
                    admin.getStudents().remove(student);
                    adminRepository.save(admin); // Update admin to reflect removal

                    // Check if any other admin is linked to this student
                    List<Admin> adminsWithStudent = adminRepository.findByStudentsContaining(studentId);
                    if (adminsWithStudent.isEmpty()) {
                        studentRepository.delete(student); // Delete student record
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public String addQuiz(Quiz quiz, String adminEmail) {
        Admin admin = adminRepository.findByEmail(adminEmail);
        if (admin == null) {
            return "Error: Admin not found!";
        }
        quiz.setAdminObj(admin);
        quizRepository.save(quiz); // createdAt will remain null
//        System.out.println(quiz);
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

    @Transactional
    public boolean deletequiz(int id) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isPresent()) {
            quizSubmissionRepository.deleteByQuizId(id);
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
        Quiz q = quizRepository.findById(quizid).orElseThrow(() -> new RuntimeException("Quiz not found"));
        q.setAvailable(true);
        q.setCreatedAt(LocalDateTime.now()); // Set the upload time
        quizRepository.save(q);
//        System.out.println(q);
        return "Upload successfully!";
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

    public ResponseEntity<String> updateStudent(String id, Student updatedStudent) {

        String email = updatedStudent.getEmail();
        Student existingStudent = studentRepository.findByEmailAndStudentID(email,id);
        if (existingStudent!=null) {

            if (updatedStudent.getRollNumber() != null) {
                existingStudent.setRollNumber(updatedStudent.getRollNumber());
            }
            if (updatedStudent.getSem() != null) {
                existingStudent.setSem(updatedStudent.getSem());
            }

            studentRepository.save(existingStudent);
            return ResponseEntity.ok("Student updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Student not found");
        }
    }

    public String generateQuestions(int quizid, int numQuestions, String description, String difficulty) {
        String prompt = String.format("""
        Generate %d %s difficulty multiple-choice questions on:
        %s

        Format your response strictly as a JSON array with the following structure:
        [
          {
            "question": "...",
            "answer": "...",
            "option1": "...",
            "option2": "...",
            "option3": "...",
            "option4": "..."
          }
        ]
    """, numQuestions, difficulty, description);

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, String>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));
        requestBody.put("contents", List.of(Map.of("parts", parts)));

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;

        RestTemplate restTemplate = new RestTemplate();
        try {
            JsonNode response = restTemplate.postForObject(url, requestBody, JsonNode.class);
            String text = response.at("/candidates/0/content/parts/0/text").asText();

            // ✅ Strip markdown/code block formatting
            text = text.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            // ✅ Parse the cleaned text to your object
            List<Question> questions = Arrays.asList(objectMapper.readValue(text, Question[].class));

            Optional<Quiz> quizOpt = quizRepository.findById(quizid);
            if (quizOpt.isEmpty()) return "Quiz ID not found.";
            Quiz quiz = quizOpt.get();

            for (Question q : questions) {
                q.setQuiz(quiz);
                questionRepository.save(q);
            }

            return questions.size() + " questions generated and saved successfully.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error while generating questions: " + e.getMessage();
        }
    }


}
