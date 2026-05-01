package com.univille.AccessControl.exception;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ErroResponse {

    private TipoErro tipo;
    private String mensagem;
    private int status;
    private LocalDateTime dataHora;
    private Map<String, String> erros;
}
