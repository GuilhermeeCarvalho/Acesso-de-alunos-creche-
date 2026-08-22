package com.univille.AccessControl.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Dados necessários para registrar entrada ou saída")
public class RegistroRequest {

    @NotNull
    @Schema(description = "ID da criança", example = "1")
    private Long criancaId;

    @NotNull
    @Schema(description = "ID do responsável", example = "2")
    private Long responsavelId;

    @Schema(description = "Observação opcional para o registro", example = "Aluno chegou acompanhado")
    private String observacao;
}
