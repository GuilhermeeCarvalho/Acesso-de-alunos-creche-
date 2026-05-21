package com.univille.AccessControl.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Dados necessários para vincular um responsável a uma criança")
public class VinculoResponsavelRequest {

    @Schema(description = "ID da criança", example = "1")
    private Long criancaId;

    @Schema(description = "ID do responsável", example = "2")
    private Long responsavelId;

    @Schema(description = "Tipo de relação", example = "PAI")
    private String relacao;
}