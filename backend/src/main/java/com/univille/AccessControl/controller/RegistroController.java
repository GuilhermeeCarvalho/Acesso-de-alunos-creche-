package com.univille.AccessControl.controller;

import com.univille.AccessControl.dto.RegistroRequest;
import com.univille.AccessControl.model.Registro;
import com.univille.AccessControl.service.RegistroService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registro")
public class RegistroController {

    private final RegistroService service;

    public RegistroController(RegistroService service) {
        this.service = service;
    }

    @PostMapping("/entrada")
    public ResponseEntity<Registro> entrada(@RequestBody @Valid RegistroRequest request) {
        return ResponseEntity.ok(service.registrarEntrada(request));
    }

    @PostMapping("/saida")
    public ResponseEntity<Registro> saida(@RequestBody @Valid RegistroRequest request) {
        return ResponseEntity.ok(service.registrarSaida(request));
    }
    @GetMapping
    public ResponseEntity<List<Registro>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }
}
