package com.univille.AccessControl.controller;

import com.univille.AccessControl.config.OpenApiConfig;
import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.service.FuncionarioService;
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
@RequestMapping("/funcionarios")
@Tag(name = "Funcionários", description = "Cadastro e consulta de funcionários")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @Operation(summary = "Cadastrar funcionário", description = "Salva um novo funcionário no sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Funcionário cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @PostMapping
    public ResponseEntity<Funcionario> criar(@RequestBody @Valid Funcionario funcionario) {

        return ResponseEntity.ok(
                service.salvar(funcionario)
        );
    }

    @Operation(summary = "Listar funcionários", description = "Retorna todos os funcionários cadastrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista carregada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @GetMapping
    public List<Funcionario> listar() {
        return service.listarTodos();
    }
}