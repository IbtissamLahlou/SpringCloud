package ma.ac.emi.enrollment.service;

import ma.ac.emi.enrollment.DTO.CoursDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Course")
public interface CoursClient {

    @GetMapping("/courses/{id}")
    CoursDto getCoursById(@PathVariable Long id);
}

