package ma.ac.emi.enrollment.service;

import ma.ac.emi.enrollment.entity.Enrollment;
import ma.ac.emi.enrollment.repo.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

import java.util.Collections;
import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // Nom du circuit breaker : enrollmentService
    @CircuitBreaker(name = "enrollmentService", fallbackMethod = "fallbackGetEnrollmentsByStudent")
    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    @CircuitBreaker(name = "enrollmentService", fallbackMethod = "fallbackGetEnrollmentsByCourse")
    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @CircuitBreaker(name = "enrollmentService", fallbackMethod = "fallbackSaveEnrollment")
    public Enrollment saveEnrollment(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    @CircuitBreaker(name = "enrollmentService", fallbackMethod = "fallbackGetAllEnrollments")
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @CircuitBreaker(name = "enrollmentService", fallbackMethod = "fallbackGetEnrollmentById")
    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id).orElse(null);
    }

    // Méthodes de fallback
    public List<Enrollment> fallbackGetEnrollmentsByStudent(Long studentId, Throwable throwable) {
        // Log et retourner une valeur par défaut
        System.err.println("Erreur dans getEnrollmentsByStudent: " + throwable.getMessage());
        return Collections.emptyList();
    }

    public List<Enrollment> fallbackGetEnrollmentsByCourse(Long courseId, Throwable throwable) {
        System.err.println("Erreur dans getEnrollmentsByCourse: " + throwable.getMessage());
        return Collections.emptyList();
    }

    public Enrollment fallbackSaveEnrollment(Enrollment enrollment, Throwable throwable) {
        System.err.println("Erreur dans saveEnrollment: " + throwable.getMessage());
        return null;
    }

    public List<Enrollment> fallbackGetAllEnrollments(Throwable throwable) {
        System.err.println("Erreur dans getAllEnrollments: " + throwable.getMessage());
        return Collections.emptyList();
    }

    public Enrollment fallbackGetEnrollmentById(Long id, Throwable throwable) {
        System.err.println("Erreur dans getEnrollmentById: " + throwable.getMessage());
        return null;
    }
}
