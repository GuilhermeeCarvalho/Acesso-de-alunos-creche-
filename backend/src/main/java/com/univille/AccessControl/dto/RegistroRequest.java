package com.univille.AccessControl.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistroRequest {

    @NotNull
    private Long criancaId;

    @NotNull
    private Long responsavelId;

    @NotNull
    private Long funcionarioId;
}
