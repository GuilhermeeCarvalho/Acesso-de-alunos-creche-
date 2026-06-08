package com.univille.AccessControl.dto;

import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Role;

public record FuncionarioListDTO(Long id, String nome, String email, Role role) {

    public static FuncionarioListDTO fromEntity(Funcionario funcionario) {
        if (funcionario == null) {
            return null;
        }

        return new FuncionarioListDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getEmail(),
                funcionario.getRole()
        );
    }
}