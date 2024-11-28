package ma.ac.emi.enrollment.controller;

import ma.ac.emi.enrollment.entity.Enrollment;
import ma.ac.emi.enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private RestTemplate restTemplate;

    // Method to assign a course to a student
    @PostMapping("/student/{studentId}/course/{courseId}")
    public Map<String, Object> assignCourseToStudent(@PathVariable Long studentId, @PathVariable Long courseId) {
        // Check if the student is already enrolled in the course
        boolean alreadyEnrolled = enrollmentService.getAllEnrollments().stream()
                .anyMatch(enrollment -> enrollment.getStudentId().equals(studentId) && enrollment.getCourseId().equals(courseId));

        Map<String, Object> response = new HashMap<>();

        if (alreadyEnrolled) {
            // If already enrolled, send a response indicating the student is already enrolled
            response.put("message", "Student is already enrolled in this course.");
            return response;  // Prevent enrollment if already exists
        }

        // Create a new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);

        // Save the enrollment in the Enrollment service
        enrollmentService.saveEnrollment(enrollment);

        // Return a success message
        response.put("message", "Student successfully enrolled in the course.");
        response.put("studentId", studentId);
        response.put("courseId", courseId);

        return response;
    }


    // Method to get all enrollments grouped by studentId (for viewing)
    @GetMapping
    public List<Map<String, Object>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        Map<Long, List<Enrollment>> groupedByStudent = enrollments.stream()
                .collect(Collectors.groupingBy(Enrollment::getStudentId));

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<Long, List<Enrollment>> entry : groupedByStudent.entrySet()) {
            Long studentId = entry.getKey();
            List<Enrollment> studentEnrollments = entry.getValue();

            // Construct the URL to get student details from the Student service
            String studentServiceUrl = "http://localhost:8081/students/" + studentId;
            Map<String, Object> student = restTemplate.getForObject(studentServiceUrl, Map.class);

            List<Map<String, Object>> courses = new ArrayList<>();
            for (Enrollment enrollment : studentEnrollments) {
                Long courseId = enrollment.getCourseId();
                // Construct the URL to get course details from the Course service
                String courseServiceUrl = "http://localhost:8082/courses/" + courseId;
                Map<String, Object> course = restTemplate.getForObject(courseServiceUrl, Map.class);
                courses.add(course);
            }

            Map<String, Object> studentData = new HashMap<>();
            studentData.put("studentId", studentId);
            studentData.put("studentName", student.get("name"));
            studentData.put("studentEmail", student.get("email"));
            studentData.put("courses", courses);

            response.add(studentData);
        }

        return response;
    }
}
