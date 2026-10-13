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
            regexp = "^(\\+55\\s?)?\\(?\\d{2}\\)?\\s?9\\d{4}-?\\d{4}$",
            message = "Telefone inválido. Use DDD + 9 dígitos. Ex.: 47 997285634"
    )
    private String telefone;
}
