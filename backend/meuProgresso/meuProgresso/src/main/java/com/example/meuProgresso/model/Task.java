package com.example.meuProgresso.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description; // Ex: "Comprar Whey Protein"

    private LocalDate dueDate; // Data limite da tarefa

    private boolean isDone = false; // 1. Começa como não concluída por padrão

    // Getters e Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public boolean isDone() { return isDone; }
    public void setDone(boolean done) { isDone = done; }
}