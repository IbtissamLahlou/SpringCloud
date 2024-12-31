package ma.ac.emi.enrollment.controller;

import ma.ac.emi.enrollment.DTO.CoursDto;
import ma.ac.emi.enrollment.DTO.EtudiantDto;
import ma.ac.emi.enrollment.entity.Enrollment;
import ma.ac.emi.enrollment.service.CoursClient;
import ma.ac.emi.enrollment.service.EnrollmentService;
import ma.ac.emi.enrollment.service.EtudiantClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private EtudiantClient etudiantClient;

    @Autowired
    private CoursClient coursClient;

    // Enroll Student In Course
    @PostMapping("/student/{studentId}/course/{courseId}")
    public Map<String, Object> assignCourseToStudent(@PathVariable Long studentId, @PathVariable Long courseId) {
        boolean alreadyEnrolled = enrollmentService.getAllEnrollments().stream()
                .anyMatch(enrollment -> enrollment.getStudentId().equals(studentId) && enrollment.getCourseId().equals(courseId));
        Map<String, Object> response = new HashMap<>();
        if (alreadyEnrolled) {
            response.put("message", "Student is already enrolled in this course.");
            return response;
        }
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);
        enrollmentService.saveEnrollment(enrollment);
        response.put("message", "Student successfully enrolled in the course.");
        response.put("studentId", studentId);
        response.put("courseId", courseId);
        return response;
    }

    // Enrollment By Id
    @CircuitBreaker(name = "Enrollment", fallbackMethod = "getEnrollmentByIdFallback")
    @GetMapping("/{id}")
    public Map<String, Object> getEnrollmentById(@PathVariable Long id) {
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        if (enrollment == null) {
            throw new RuntimeException("Enrollment not found with id: " + id);
        }
        EtudiantDto student = etudiantClient.getEtudiantById(enrollment.getStudentId());
        CoursDto course = coursClient.getCoursById(enrollment.getCourseId());
        Map<String, Object> response = new HashMap<>();
        response.put("enrollmentId", enrollment.getId());
        response.put("student", student);
        response.put("course", course);
        return response;
    }

    public Map<String, Object> getEnrollmentByIdFallback(Long id, Throwable throwable) {
        Map<String, Object> fallbackResponse = new HashMap<>();
        fallbackResponse.put("message", "Enrollment information is temporarily unavailable.");
        fallbackResponse.put("enrollmentId", id);
        fallbackResponse.put("error", throwable.getMessage());
        return fallbackResponse;
    }

    // Courses enrolled by a Student
    @CircuitBreaker(name = "Enrollment", fallbackMethod = "getEnrollmentsByStudentIdFallback")
    @GetMapping("/student/{studentId}")
    public Map<String, Object> getEnrollmentsByStudentId(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments()
                .stream()
                .filter(enrollment -> enrollment.getStudentId().equals(studentId))
                .collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        if (enrollments.isEmpty()) {
            response.put("message", "No enrollments found for studentId: " + studentId);
            return response;
        }
        EtudiantDto student = etudiantClient.getEtudiantById(studentId);
        if (student == null) {
            response.put("message", "Student not found with studentId: " + studentId);
            return response;
        }
        List<Map<String, Object>> courses = enrollments.stream()
                .map(enrollment -> {
                    CoursDto course = coursClient.getCoursById(enrollment.getCourseId());
                    Map<String, Object> courseDetails = new HashMap<>();
                    courseDetails.put("courseId", course.getId());
                    courseDetails.put("courseName", course.getName());
                    courseDetails.put("courseDescription", course.getDescription());
                    return courseDetails;
                })
                .collect(Collectors.toList());
        response.put("studentId", student.getId());
        response.put("studentName", student.getName());
        response.put("studentEmail", student.getEmail());
        response.put("enrollments", courses);

        return response;
    }

    public Map<String, Object> getEnrollmentsByStudentIdFallback(Long studentId, Throwable throwable) {
        Map<String, Object> fallbackResponse = new HashMap<>();
        fallbackResponse.put("message", "Enrollment details for the student are temporarily unavailable.");
        fallbackResponse.put("studentId", studentId);
        fallbackResponse.put("error", throwable.getMessage());
        return fallbackResponse;
    }

    // Students enrolled in a course
    @CircuitBreaker(name = "Enrollment", fallbackMethod = "getStudentsByCourseIdFallback")
    @GetMapping("/course/{courseId}")
    public Map<String, Object> getStudentsByCourseId(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments()
                .stream()
                .filter(enrollment -> enrollment.getCourseId().equals(courseId))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        if (enrollments.isEmpty()) {
            response.put("message", "No students found for courseId: " + courseId);
            return response;
        }
        CoursDto course = coursClient.getCoursById(courseId);
        List<Map<String, Object>> students = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            Long studentId = enrollment.getStudentId();
            if (studentId != null) {
                EtudiantDto student = etudiantClient.getEtudiantById(studentId);
                Map<String, Object> studentDetails = new HashMap<>();
                studentDetails.put("studentId", student.getId());
                studentDetails.put("studentName", student.getName());
                studentDetails.put("studentEmail", student.getEmail());
                students.add(studentDetails);
            }
        }
        response.put("courseId", course.getId());
        response.put("courseName", course.getName());
        response.put("courseDescription", course.getDescription());
        response.put("enrolledStudents", students);
        return response;
    }

    public Map<String, Object> getStudentsByCourseIdFallback(Long courseId, Throwable throwable) {
        Map<String, Object> fallbackResponse = new HashMap<>();
        fallbackResponse.put("message", "Student details for the course are temporarily unavailable.");
        fallbackResponse.put("courseId", courseId);
        fallbackResponse.put("error", throwable.getMessage());
        return fallbackResponse;
    }
}
