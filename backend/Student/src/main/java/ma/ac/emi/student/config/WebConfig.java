package ma.ac.emi.student.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Permet toutes les routes
                        .allowedOrigins("http://localhost:3000") // Permet seulement l'origine React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permet les méthodes HTTP
                        .allowedHeaders("*") // Permet tous les headers
                        .allowCredentials(true); // Permet l'envoi des cookies si nécessaire
            }
        };
    }
}
