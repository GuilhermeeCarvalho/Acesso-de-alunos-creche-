package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.dto.VinculoResponsavelRequest;
import com.univille.AccessControl.service.ResponsavelCriancaService;
import com.univille.AccessControl.dto.ResponsavelCriancaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vinculos")
@Tag(name = "Vínculos", description = "Associação entre responsáveis e crianças")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class ResponsavelCriancaController {

    private final ResponsavelCriancaService service;

    public ResponsavelCriancaController(
            ResponsavelCriancaService service
    ) {
        this.service = service;
    }

    @Operation(summary = "Vincular responsável à criança", description = "Cria um vínculo entre responsável e criança.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vínculo criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> vincular(
            @RequestBody VinculoResponsavelRequest request
    ) {

        service.vincular(request);

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Listar responsáveis da criança", description = "Retorna os responsáveis vinculados a uma criança específica.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Criança não encontrada")
    })
    @GetMapping("/crianca/{id}")
    public ResponseEntity<List<ResponsavelCriancaResponse>>
    listarResponsaveis(@Parameter(description = "ID da criança") @PathVariable Long id) {

        return ResponseEntity.ok(
                service.listarResponsaveisDaCrianca(id)
        );
    }

    @Operation(summary = "Remover vínculo do responsável", description = "Remove a associação entre um responsável e uma criança.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vínculo removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Vínculo ou criança não encontrado")
    })
    @DeleteMapping("/crianca/{criancaId}/responsavel/{responsavelId}")
    public ResponseEntity<?> removerVinculo(
            @Parameter(description = "ID da criança") @PathVariable Long criancaId,
            @Parameter(description = "ID do responsável") @PathVariable Long responsavelId
    ) {
        service.removerVinculo(criancaId, responsavelId);
        return ResponseEntity.ok().build();
    }
}