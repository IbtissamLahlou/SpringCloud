package ma.ac.emi.student.controller;

import ma.ac.emi.student.entity.Student;
import ma.ac.emi.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{studentId}")
    public Student getStudentById(@PathVariable Long studentId) {
        return studentService.getStudentById(studentId);
    }

    @GetMapping("/courses/{courseId}")
    public List<Long> getStudentsByCourse(@PathVariable Long courseId) {
        List<Student> students = studentService.getAllStudents();
        return students.stream()
                .filter(student -> student.getCourseIds().contains(courseId))
                .map(Student::getId)
                .collect(Collectors.toList());
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @DeleteMapping("/{studentId}")
    public void deleteStudent(@PathVariable Long studentId) {
        studentService.deleteStudent(studentId);
    }

    @PutMapping("/{studentId}/courses/{courseId}")
    public Student assignCourseToStudent(@PathVariable Long studentId, @PathVariable Long courseId) {
        return studentService.assignCourseToStudent(studentId, courseId);
    }




}
