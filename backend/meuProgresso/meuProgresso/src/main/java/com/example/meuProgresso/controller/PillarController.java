package com.example.meuProgresso.controller;

import com.example.meuProgresso.model.Pillar;
import com.example.meuProgresso.repository.PillarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController // 1. Define esta classe como um controlador REST
@RequestMapping("/api/pillars") // 2. Define a URL base para todos os métodos nesta classe
public class PillarController {

    @Autowired // 3. Injeção de Dependência: O Spring vai nos dar uma instância do PillarRepository
    private PillarRepository pillarRepository;

    // Endpoint para CRIAR um novo pilar
    @PostMapping
    public ResponseEntity<Pillar> createPillar(@RequestBody Pillar pillar) {
        Pillar savedPillar = pillarRepository.save(pillar);
        return new ResponseEntity<>(savedPillar, HttpStatus.CREATED);
    }

    // Endpoint para BUSCAR TODOS os pilares
    @GetMapping
    public List<Pillar> getAllPillars() {
        return pillarRepository.findAll();
    }

    // Endpoint para BUSCAR UM pilar pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Pillar> getPillarById(@PathVariable Long id) {
        Optional<Pillar> pillar = pillarRepository.findById(id);
        // Se o pilar existir, retorna ele com status 200 OK. Se não, retorna 404 Not Found.
        return pillar.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
}