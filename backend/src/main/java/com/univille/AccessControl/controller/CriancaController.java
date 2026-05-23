package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.service.CriancaService;
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

    private final CriancaService service;

    public CriancaController(CriancaService service) {
        this.service = service;
    }

    @Operation(summary = "Cadastrar criança", description = "Cria uma nova criança no sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Criança cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<Crianca> criar(@RequestBody @Valid Crianca crianca) {
        return ResponseEntity.ok(service.salvar(crianca));
    }

    @Operation(summary = "Listar crianças", description = "Retorna todas as crianças cadastradas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso")
    })
    @GetMapping
    public List<Crianca> listar() {
        return service.listarTodos();
    }

    @Operation(summary = "Atualizar criança", description = "Atualiza os dados de uma criança existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Criança atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Criança não encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Crianca> atualizar(@PathVariable Long id, @RequestBody @Valid Crianca crianca) {
        return ResponseEntity.ok(service.atualizar(id, crianca));
    }

    @Operation(summary = "Excluir criança", description = "Remove uma criança do sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Criança removida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Criança não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
