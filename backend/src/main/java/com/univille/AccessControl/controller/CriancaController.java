package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.repository.CriancaRepository;
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
@RequestMapping("/criancas")
@Tag(name = "Crianças", description = "Cadastro e consulta de crianças")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class CriancaController {

    private final CriancaRepository repository;

    public CriancaController(CriancaRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Cadastrar criança", description = "Cria uma nova criança no sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Criança cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<Crianca> criar(@RequestBody @Valid Crianca crianca) {
        return ResponseEntity.ok(repository.save(crianca));
    }

    @Operation(summary = "Listar crianças", description = "Retorna todas as crianças cadastradas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso")
    })
    @GetMapping
    public List<Crianca> listar() {
        return repository.findAll();
    }
}
