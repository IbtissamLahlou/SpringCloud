package ma.ac.emi.enrollment.controller;

import ma.ac.emi.enrollment.entity.Enrollment;
import ma.ac.emi.enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/student/{studentId}/course/{courseId}")
    public Enrollment assignCourseToStudent(@PathVariable Long studentId, @PathVariable Long courseId) {
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);

        enrollmentService.saveEnrollment(enrollment);

        String studentServiceUrl = "http://localhost:8081/students/" + studentId + "/courses/" + courseId;
        restTemplate.put(studentServiceUrl, null);

        return enrollment;  
    }
}
