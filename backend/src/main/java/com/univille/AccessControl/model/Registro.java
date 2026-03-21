package com.univille.AccessControl.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.univille.AccessControl.model.TipoRegistro;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "crianca_id")
    private Crianca crianca;

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private Responsavel responsavel;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @Enumerated(EnumType.STRING)
    private TipoRegistro tipo;

    private LocalDateTime dataHora;

    @PrePersist
    public void prePersist() {
        this.dataHora = LocalDateTime.now();
    }
}
