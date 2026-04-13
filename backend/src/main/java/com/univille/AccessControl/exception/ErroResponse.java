package com.univille.AccessControl.exception;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ErroResponse {

    private String erro;
    private String mensagem;
    private int status;
    private LocalDateTime dataHora;
}
