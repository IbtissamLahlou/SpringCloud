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



    //All Courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // Create Course
    @PostMapping
    public Course saveCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }

    // Course By Id
    @GetMapping("/{courseId}")
    public Course getCourseById(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId);
    }



}
