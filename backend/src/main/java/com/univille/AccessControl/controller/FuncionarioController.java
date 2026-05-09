package com.univille.AccessControl.controller;

import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(@RequestBody @Valid Funcionario funcionario) {

        return ResponseEntity.ok(
                service.salvar(funcionario)
        );
    }

    @GetMapping
    public List<Funcionario> listar() {
        return service.listarTodos();
    }
}