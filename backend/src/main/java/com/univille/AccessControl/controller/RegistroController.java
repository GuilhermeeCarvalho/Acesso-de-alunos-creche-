package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.dto.RegistroRequest;
import com.univille.AccessControl.model.Registro;
import com.univille.AccessControl.service.RegistroService;
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
@RequestMapping("/registro")
@Tag(name = "Registros", description = "Registro de entrada, saída e consulta de movimentações")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class RegistroController {

    private final RegistroService service;

    public RegistroController(RegistroService service) {
        this.service = service;
    }

    @Operation(summary = "Registrar entrada", description = "Registra a entrada da criança com base no responsável informado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Entrada registrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/entrada")
    public ResponseEntity<Registro> entrada(@RequestBody @Valid RegistroRequest request) {
        return ResponseEntity.ok(service.registrarEntrada(request));
    }

    @Operation(summary = "Registrar saída", description = "Registra a saída da criança com base no responsável informado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Saída registrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/saida")
    public ResponseEntity<Registro> saida(@RequestBody @Valid RegistroRequest request) {
        return ResponseEntity.ok(service.registrarSaida(request));
    }

    @Operation(summary = "Listar registros", description = "Retorna todos os registros de entrada e saída.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso")
    })
    @GetMapping
    public ResponseEntity<List<Registro>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Excluir registro", description = "Remove um registro de entrada ou saída do sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Registro removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Registro não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.ok().build();
    }
}
