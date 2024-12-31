package ma.ac.emi.enrollment.DTO;
import lombok.Data;
@Data
public class EtudiantDto {
    private Long studentId;
    private String name;  // Make sure this matches the property name in the response from the Student Service
    private String email;
    // Getters and setters

    public Long getId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}