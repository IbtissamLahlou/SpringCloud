package ma.ac.emi.enrollment.service;

import ma.ac.emi.enrollment.DTO.CoursDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cours-service", url = "http://localhost:8082/courses")
public interface CoursClient {

    @GetMapping("/{id}")
    CoursDto getCoursById(@PathVariable Long id);
}