package com.univille.AccessControl.dto;

import com.univille.AccessControl.model.TipoRelacao;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponsavelCriancaResponse {

    private Long responsavelId;

    private String nome;

    private String telefone;

    private TipoRelacao relacao;
}
