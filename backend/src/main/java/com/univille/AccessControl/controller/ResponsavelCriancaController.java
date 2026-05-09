package com.univille.AccessControl.controller;

import com.univille.AccessControl.dto.VinculoResponsavelRequest;
import com.univille.AccessControl.service.ResponsavelCriancaService;
import com.univille.AccessControl.dto.ResponsavelCriancaResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vinculos")
public class ResponsavelCriancaController {

    private final ResponsavelCriancaService service;

    public ResponsavelCriancaController(
            ResponsavelCriancaService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> vincular(
            @RequestBody VinculoResponsavelRequest request
    ) {

        service.vincular(request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/crianca/{id}")
    public ResponseEntity<List<ResponsavelCriancaResponse>>
    listarResponsaveis(@PathVariable Long id) {

        return ResponseEntity.ok(
                service.listarResponsaveisDaCrianca(id)
        );
    }
}