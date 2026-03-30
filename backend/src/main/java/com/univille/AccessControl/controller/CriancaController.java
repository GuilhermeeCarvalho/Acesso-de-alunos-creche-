package com.univille.AccessControl.controller;

import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.repository.CriancaRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/criancas")
public class CriancaController {

    private final CriancaRepository repository;

    public CriancaController(CriancaRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Crianca> criar(@RequestBody @Valid Crianca crianca) {
        return ResponseEntity.ok(repository.save(crianca));
    }

    @GetMapping
    public List<Crianca> listar() {
        return repository.findAll();
    }
}
