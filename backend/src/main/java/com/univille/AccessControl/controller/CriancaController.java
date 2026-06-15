package com.univille.AccessControl.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.service.CriancaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

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

    @Operation(summary = "Upload de documento da criança", description = "Envia a foto do documento para armazenamento externo e atualiza o caminho no registro da criança.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documento salvo com sucesso"),
            @ApiResponse(responseCode = "400", description = "Arquivo inválido"),
            @ApiResponse(responseCode = "404", description = "Criança não encontrada")
    })
    @PostMapping(value = "/{id}/documento", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Crianca> uploadDocumento(@PathVariable Long id,
                                                  @RequestPart("arquivo") MultipartFile arquivo) {
        return ResponseEntity.ok(service.salvarDocumento(id, arquivo));
    }

    @Operation(summary = "Obter documento da criança", description = "Retorna o caminho e metadados do documento cadastrado para a criança.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documento encontrado"),
            @ApiResponse(responseCode = "404", description = "Criança não encontrada")
    })
    @GetMapping("/{id}/documento")
    public ResponseEntity<Map<String, Object>> buscarDocumento(@PathVariable Long id) {
        Map<String, Object> dadosDocumento = service.buscarDocumento(id);
        return ResponseEntity.ok(dadosDocumento);
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
