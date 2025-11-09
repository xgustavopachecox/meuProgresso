package com.example.meuProgresso.repository;

import com.example.meuProgresso.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Exemplo de método customizado: buscar tarefas não concluídas
    // List<Task> findByIsDoneFalse();
}