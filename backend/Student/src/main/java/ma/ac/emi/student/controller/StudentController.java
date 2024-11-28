package ma.ac.emi.student.controller;

import ma.ac.emi.student.entity.Student;
import ma.ac.emi.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

import java.util.*;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private WebClient.Builder webClientBuilder; // Inject the WebClient.Builder

    // Endpoint to get all students without course details
    @GetMapping
    public List<Map<String, Object>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Student student : students) {
            Map<String, Object> studentData = new HashMap<>();
            studentData.put("id", student.getId());
            studentData.put("name", student.getName());
            studentData.put("email", student.getEmail());
            // No course details here
            response.add(studentData);
        }

        return response;
    }

    // Endpoint to get a student by ID without course details
    @GetMapping("/{studentId}")
    public Map<String, Object> getStudent(@PathVariable Long studentId) {
        Student student = studentService.getStudentById(studentId);

        Map<String, Object> response = new HashMap<>();
        response.put("studentId", student.getId());
        response.put("name", student.getName());
        response.put("email", student.getEmail());

        // No course details included
        return response;
    }

    // Endpoint to get students enrolled in a particular course by courseId
    @GetMapping("/courses/{courseId}")
    public List<Map<String, Object>> getStudentsEnrolledInCourse(@PathVariable Long courseId) {
        // URL to call the Enrollment service to get all students enrolled in the course
        String enrollmentServiceUrl = "http://localhost:8083/enrollments/course/" + courseId;

        // Call the Enrollment microservice to get the list of enrollments (students enrolled in the course)
        List<Map<String, Object>> enrolledStudents = webClientBuilder.build()
                .get()
                .uri(enrollmentServiceUrl)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        // Prepare response containing student details
        List<Map<String, Object>> response = new ArrayList<>();

        if (enrolledStudents != null) {
            for (Map<String, Object> enrollment : enrolledStudents) {
                // Safely handle the studentId and ensure it's cast correctly as a Long
                Long studentId = ((Number) enrollment.get("studentId")).longValue();  // Ensures it is cast to Long

                // Get student details from the local database
                Student student = studentService.getStudentById(studentId);
                if (student != null) {
                    Map<String, Object> studentData = new HashMap<>();
                    studentData.put("studentId", student.getId());
                    studentData.put("name", student.getName());
                    studentData.put("email", student.getEmail());

                    response.add(studentData);
                }
            }
        }

        return response;
    }

}
