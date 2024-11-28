package ma.ac.emi.student.controller;

import ma.ac.emi.student.entity.Student;
import ma.ac.emi.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // All Students
    @GetMapping
    public List<Map<String, Object>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Student student : students) {
            Map<String, Object> studentData = new HashMap<>();
            studentData.put("id", student.getId());
            studentData.put("name", student.getName());
            studentData.put("email", student.getEmail());
            response.add(studentData);
        }
        return response;
    }

    // Student By Id
    @GetMapping("/{studentId}")
    public Map<String, Object> getStudent(@PathVariable Long studentId) {
        Student student = studentService.getStudentById(studentId);
        Map<String, Object> response = new HashMap<>();
        response.put("studentId", student.getId());
        response.put("name", student.getName());
        response.put("email", student.getEmail());
        return response;
    }

    // Create Student
    @PostMapping
    public Student saveStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }



}
