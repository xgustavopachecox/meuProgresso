package com.example.meuProgresso.repository;
import com.example.meuProgresso.model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    // Aqui também poderíamos criar métodos customizados, como buscar
    // todos os logs de um determinado mês:
    // List<DailyLog> findByLogDateBetween(LocalDate start, LocalDate end);
}