package com.univille.AccessControl.controller;

import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.repository.FuncionarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioRepository repository;

    public FuncionarioController(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(@RequestBody @Valid Funcionario funcionario) {
        return ResponseEntity.ok(repository.save(funcionario));
    }

    @GetMapping
    public List<Funcionario> listar() {
        return repository.findAll();
    }
}
