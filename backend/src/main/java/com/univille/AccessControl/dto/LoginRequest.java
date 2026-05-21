package com.univille.AccessControl.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Credenciais de acesso usadas no login")
public class LoginRequest {

    @Schema(description = "E-mail do usuário", example = "admin@creche.com")
    private String email;

    @Schema(description = "Senha do usuário", example = "123456")
    private String senha;
}
