package com.example.meuProgresso.model;
import jakarta.persistence.*;
import java.time.LocalDate; // 1. Usar o tipo certo para datas

@Entity
@Table(name = "daily_logs")
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate logDate; // 2. A data do registro, ex: 2025-10-14

    @Column(columnDefinition = "TEXT")
    private String completedDetails; // JSON com os dados preenchidos, ex: pesos, reps...

    @ManyToOne
    @JoinColumn(name = "template_id") // 3. O registro foi feito usando qual template?
    private RoutineTemplate template;

    // Getters e Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getLogDate() { return logDate; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public String getCompletedDetails() { return completedDetails; }
    public void setCompletedDetails(String completedDetails) { this.completedDetails = completedDetails; }
    public RoutineTemplate getTemplate() { return template; }
    public void setTemplate(RoutineTemplate template) { this.template = template; }
}