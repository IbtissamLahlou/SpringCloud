package ma.ac.emi.enrollment.service;

import ma.ac.emi.enrollment.DTO.EtudiantDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name ="Student")
public interface EtudiantClient {

    @GetMapping("/students/{id}")
    EtudiantDto getEtudiantById(@PathVariable Long id);
}