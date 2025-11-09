package com.example.meuProgresso.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // 1. Diz ao JPA que esta classe é uma tabela do banco
@Table(name = "pillars") // 2. Define o nome da tabela (boas práticas usam plural)
public class Pillar {

    @Id // 3. Marca este campo como a chave primária (identificador único)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 4. O banco de dados vai gerar o valor do ID automaticamente
    private Long id;

    private String name; // Coluna para o nome, ex: "Treino"

    private String icon; // Coluna para o ícone, ex: "dumbbell"

    private String color; // Coluna para a cor, ex: "#10B981"

    // 5. Getters e Setters (essenciais para o JPA funcionar)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}