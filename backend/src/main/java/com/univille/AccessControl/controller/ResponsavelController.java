package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.service.ResponsavelService;
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

    private final ResponsavelService service;

    public ResponsavelController(ResponsavelService service) {
        this.service = service;
    }

    @Operation(summary = "Cadastrar responsável", description = "Cria um novo responsável no sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Responsável cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid Responsavel responsavel) {
        return ResponseEntity.ok(service.salvar(responsavel));
    }

    @Operation(summary = "Listar responsáveis", description = "Retorna todos os responsáveis cadastrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso")
    })
    @GetMapping
    public List<Responsavel> listar() {
        return service.listarTodos();
    }

    @Operation(summary = "Atualizar responsável", description = "Atualiza os dados de um responsável existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Responsável atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Responsável não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Responsavel> atualizar(@PathVariable Long id, @RequestBody @Valid Responsavel responsavel) {
        return ResponseEntity.ok(service.atualizar(id, responsavel));
    }

    @Operation(summary = "Excluir responsável", description = "Remove um responsável do sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Responsável removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Responsável não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
