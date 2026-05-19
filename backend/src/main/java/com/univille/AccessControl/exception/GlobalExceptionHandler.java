package com.univille.AccessControl.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse handleValidationErrors(MethodArgumentNotValidException ex) {

        Map<String, String> erros = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            erros.put(error.getField(), error.getDefaultMessage());
        });

        return ErroResponse.builder()
                .tipo(TipoErro.VALIDACAO)
                .mensagem("Erro de validação")
                .status(400)
                .dataHora(LocalDateTime.now())
                .erros(erros)
                .build();
    }

    @ExceptionHandler(RegraNegocioException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse handleRegraNegocio(RegraNegocioException ex) {

        return ErroResponse.builder()
                .tipo(TipoErro.REGRA_NEGOCIO)
                .mensagem(ex.getMessage())
                .status(400)
                .dataHora(LocalDateTime.now())
                .build();
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErroResponse handleNotFound(RecursoNaoEncontradoException ex) {

        return ErroResponse.builder()
                .tipo(TipoErro.NAO_ENCONTRADO)
                .mensagem(ex.getMessage())
                .status(404)
                .dataHora(LocalDateTime.now())
                .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErroResponse handleGeneric(Exception ex) {
        logger.error("Unhandled exception", ex);

        return ErroResponse.builder()
                .tipo(TipoErro.ERRO_INTERNO)
                .mensagem("Erro inesperado no sistema")
                .status(500)
                .dataHora(LocalDateTime.now())
                .build();
    }
}
