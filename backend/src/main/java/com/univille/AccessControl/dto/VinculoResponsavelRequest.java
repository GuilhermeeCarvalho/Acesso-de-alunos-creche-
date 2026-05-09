package com.univille.AccessControl.dto;

import lombok.Data;

@Data
public class VinculoResponsavelRequest {

    private Long criancaId;
    private Long responsavelId;
    private String relacao;
}