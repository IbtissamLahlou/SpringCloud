package ma.ac.emi.course.controller;

import ma.ac.emi.course.entity.Course;
import ma.ac.emi.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping
    public Course saveCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }

    @GetMapping("/{courseId}")
    public Course getCourseById(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId);
    }


    @GetMapping("/{courseId}/students")
    public List<String> getStudentsEnrolledInCourse(@PathVariable Long courseId) {
        String url = "http://localhost:8081/students/courses/" + courseId;
        List<String> students = restTemplate.getForObject(url, List.class);
        return students;
    }

    @DeleteMapping("/{courseId}")
    public void deleteStudent(@PathVariable Long courseId) {
        courseService.deleteCourse(courseId);
    }


}
