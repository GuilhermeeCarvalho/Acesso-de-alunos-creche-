package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.repository.ResponsavelRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/responsaveis")
@Tag(name = "Responsáveis", description = "Cadastro e consulta de responsáveis")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class ResponsavelController {

    private final ResponsavelRepository repository;

    public ResponsavelController(ResponsavelRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Cadastrar responsável", description = "Cria um novo responsável no sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Responsável cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid Responsavel responsavel) {
        Responsavel salvo = repository.save(responsavel);
        return ResponseEntity.ok(salvo);
    }

    @Operation(summary = "Listar responsáveis", description = "Retorna todos os responsáveis cadastrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso")
    })
    @GetMapping
    public List<Responsavel> listar() {
        return repository.findAll();
    }
}
