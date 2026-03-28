package com.univille.AccessControl.controller;

import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.repository.ResponsavelRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/responsaveis")
public class ResponsavelController {

    private final ResponsavelRepository repository;

    public ResponsavelController(ResponsavelRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid Responsavel responsavel) {
        Responsavel salvo = repository.save(responsavel);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping
    public List<Responsavel> listar() {
        return repository.findAll();
    }
}
