package com.example.meuProgresso.repository;
import com.example.meuProgresso.model.Pillar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // 1. Diz ao Spring que esta é uma interface de repositório
public interface PillarRepository extends JpaRepository<Pillar, Long> {
    // 2. Por enquanto, não precisamos de nada aqui.
    // O JpaRepository já nos dá tudo que precisamos para um CRUD básico.
}