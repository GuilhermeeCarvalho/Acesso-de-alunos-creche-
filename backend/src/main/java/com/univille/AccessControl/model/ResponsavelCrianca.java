package com.univille.AccessControl.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ResponsavelCrianca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "crianca_id")
    private Crianca crianca;

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private Responsavel responsavel;

    @Enumerated(EnumType.STRING)
    private TipoRelacao relacao;

    // getters/setters
}