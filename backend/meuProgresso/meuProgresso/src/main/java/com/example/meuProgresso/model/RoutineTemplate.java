package com.example.meuProgresso.model;
import jakarta.persistence.*; // Importa tudo de uma vez

@Entity
@Table(name = "routine_templates")
public class RoutineTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Ex: "Treino de Peito e Tríceps"

    private String description; // Ex: "Foco em supino..."

    @Column(columnDefinition = "TEXT") // 1. Garante que o campo pode ter texto longo
    private String details; // 2. Vai guardar a estrutura em formato JSON

    @ManyToOne // 3. A anotação chave: Muitos templates podem pertencer a UM pilar
    @JoinColumn(name = "pillar_id") // 4. Define o nome da coluna da chave estrangeira
    private Pillar pillar;

    // Getters e Setters para todos os campos...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Pillar getPillar() { return pillar; }
    public void setPillar(Pillar pillar) { this.pillar = pillar; }
}