package ma.ac.emi.enrollment.controller;

import ma.ac.emi.enrollment.DTO.CoursDto;
import ma.ac.emi.enrollment.DTO.EtudiantDto;
import ma.ac.emi.enrollment.entity.Enrollment;
import ma.ac.emi.enrollment.service.CoursClient;
import ma.ac.emi.enrollment.service.EnrollmentService;
import ma.ac.emi.enrollment.service.EtudiantClient;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private RestTemplate restTemplate;

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

    // Enrollments grouped by Student
    @GetMapping
    public List<Map<String, Object>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        Map<Long, List<Enrollment>> groupedByStudent = enrollments.stream()
                .collect(Collectors.groupingBy(Enrollment::getStudentId));
        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<Long, List<Enrollment>> entry : groupedByStudent.entrySet()) {
            Long studentId = entry.getKey();
            List<Enrollment> studentEnrollments = entry.getValue();
            String studentServiceUrl = "http://localhost:8081/students/" + studentId;
            Map<String, Object> student = restTemplate.getForObject(studentServiceUrl, Map.class);
            List<Map<String, Object>> courses = new ArrayList<>();
            for (Enrollment enrollment : studentEnrollments) {
                Long courseId = enrollment.getCourseId();
                String courseServiceUrl = "http://localhost:8082/courses/" + courseId;
                Map<String, Object> course = restTemplate.getForObject(courseServiceUrl, Map.class);
                Map<String, Object> courseDetails = new HashMap<>();
                courseDetails.put("courseId", courseId);
                courseDetails.put("courseName", course.get("name"));
                courseDetails.put("courseDescription", course.get("description"));
                courseDetails.put("enrollmentId", enrollment.getId());
                courses.add(courseDetails);
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

    // Courses enrolled by a Student
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

    // Students enrolled in a course
    @GetMapping("/course/{courseId}")
    public Map<String, Object> getStudentsByCourseId(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments()
                .stream()
                .filter(enrollment -> enrollment.getCourseId().equals(courseId))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();

        if (enrollments.isEmpty()) {
            response.put("message", "No students found for courseId: " + courseId);
            return response;  // Gracefully handle no students enrolled
        }

        CoursDto course = coursClient.getCoursById(courseId);
        List<Map<String, Object>> students = enrollments.stream()
                .map(enrollment -> {
                    EtudiantDto student = etudiantClient.getEtudiantById(enrollment.getStudentId());
                    Map<String, Object> studentDetails = new HashMap<>();
                    studentDetails.put("studentId", student.getId());
                    studentDetails.put("studentName", student.getName());
                    studentDetails.put("studentEmail", student.getEmail());
                    return studentDetails;
                })
                .collect(Collectors.toList());

        response.put("courseId", course.getId());
        response.put("courseName", course.getName());
        response.put("courseDescription", course.getDescription());
        response.put("enrolledStudents", students);

        return response;
    }

    @GetMapping("/flat")
    public List<Map<String, Object>> getAllEnrollmentsFlat() {
        // Retrieve all enrollments
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            // Fetch student details from the Student service
            String studentServiceUrl = "http://localhost:8081/students/" + enrollment.getStudentId();
            Map<String, Object> student = restTemplate.getForObject(studentServiceUrl, Map.class);

            // Fetch course details from the Course service
            String courseServiceUrl = "http://localhost:8082/courses/" + enrollment.getCourseId();
            Map<String, Object> course = restTemplate.getForObject(courseServiceUrl, Map.class);

            // Construct a single enrollment entry
            Map<String, Object> enrollmentData = new HashMap<>();
            enrollmentData.put("enrollmentId", enrollment.getId());
            enrollmentData.put("studentId", enrollment.getStudentId());
            enrollmentData.put("studentName", student.get("name"));
            enrollmentData.put("studentEmail", student.get("email"));
            enrollmentData.put("courseId", enrollment.getCourseId());
            enrollmentData.put("courseName", course.get("name"));
            enrollmentData.put("courseDescription", course.get("description"));

            response.add(enrollmentData);
        }

        return response;
    }
}
