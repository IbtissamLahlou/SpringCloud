package ma.ac.emi.course.controller;

import ma.ac.emi.course.entity.Course;
import ma.ac.emi.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private WebClient.Builder webClientBuilder;

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

        return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }

    @DeleteMapping("/{courseId}")
    public void deleteCourse(@PathVariable Long courseId) {
        courseService.deleteCourse(courseId);
    }
}
