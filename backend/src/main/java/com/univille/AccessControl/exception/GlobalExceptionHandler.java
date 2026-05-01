package com.univille.AccessControl.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

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

        return ErroResponse.builder()
                .tipo(TipoErro.ERRO_INTERNO)
                .mensagem("Erro inesperado no sistema")
                .status(500)
                .dataHora(LocalDateTime.now())
                .build();
    }
}
