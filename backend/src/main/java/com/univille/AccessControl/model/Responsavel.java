package com.univille.AccessControl.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Responsavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do responsável é obrigatório")
    private String nome;

    @NotBlank (message = "O telefone do responsável é obrigatório")
    private String telefone;
}
