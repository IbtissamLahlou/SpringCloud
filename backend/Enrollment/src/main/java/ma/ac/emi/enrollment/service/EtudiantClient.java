package ma.ac.emi.enrollment.service;

import ma.ac.emi.enrollment.DTO.EtudiantDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "etudiant-service", url = "http://localhost:8081/students")
public interface EtudiantClient {

    @GetMapping("/{id}")
    EtudiantDto getEtudiantById(@PathVariable Long id);
}