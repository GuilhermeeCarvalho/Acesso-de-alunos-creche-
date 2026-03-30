package com.univille.AccessControl.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(
            regexp = "^(\\+55\\s?)?\\(?\\d{2}\\)?\\s?9?\\d{4}-?\\d{4}$",
            message = "Telefone inválido. Ex: (47) 99999-9999 ou 47999999999"
    )
    private String telefone;
}
