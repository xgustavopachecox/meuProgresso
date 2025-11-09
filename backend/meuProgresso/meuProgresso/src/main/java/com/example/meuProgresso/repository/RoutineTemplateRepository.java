package com.example.meuProgresso.repository;
import com.example.meuProgresso.model.RoutineTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineTemplateRepository extends JpaRepository<RoutineTemplate, Long> {
    // Futuramente, poderíamos adicionar aqui um método para buscar
    // todos os templates de um pilar específico, por exemplo:
    // List<RoutineTemplate> findByPillarId(Long pillarId);
    // O Spring cria a query sozinho só pelo nome do método!
}