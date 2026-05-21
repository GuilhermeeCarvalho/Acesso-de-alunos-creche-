package com.univille.AccessControl.dto;

import com.univille.AccessControl.model.TipoRelacao;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Resposta com os dados do responsável vinculado à criança")
public class ResponsavelCriancaResponse {

    @Schema(description = "ID do responsável", example = "2")
    private Long responsavelId;

    @Schema(description = "Nome do responsável", example = "Maria Silva")
    private String nome;

    @Schema(description = "Telefone do responsável", example = "47999999999")
    private String telefone;

    @Schema(description = "Tipo de relação com a criança", example = "MAE")
    private TipoRelacao relacao;
}
