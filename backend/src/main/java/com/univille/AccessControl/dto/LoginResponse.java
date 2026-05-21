package com.univille.AccessControl.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Resposta gerada após autenticação bem-sucedida")
public class LoginResponse {

    @Schema(description = "Token JWT para autenticação nas rotas protegidas")
    private String token;
}
