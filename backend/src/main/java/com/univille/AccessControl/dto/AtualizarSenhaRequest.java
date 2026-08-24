package com.univille.AccessControl.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AtualizarSenhaRequest {

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha precisa ter pelo menos 6 dígitos")
    private String senha;

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
