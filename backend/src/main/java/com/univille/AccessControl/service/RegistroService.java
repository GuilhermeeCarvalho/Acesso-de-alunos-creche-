package com.univille.AccessControl.service;

import com.univille.AccessControl.dto.RegistroRequest;
import com.univille.AccessControl.exception.RecursoNaoEncontradoException;
import com.univille.AccessControl.exception.RegraNegocioException;
import com.univille.AccessControl.model.*;
import com.univille.AccessControl.repository.*;
import org.springframework.stereotype.Service;

@Service
public class RegistroService {

    private final RegistroRepository registroRepository;
    private final CriancaRepository criancaRepository;
    private final ResponsavelRepository responsavelRepository;
    private final FuncionarioRepository funcionarioRepository;

    public RegistroService(RegistroRepository registroRepository,
                           CriancaRepository criancaRepository,
                           ResponsavelRepository responsavelRepository,
                           FuncionarioRepository funcionarioRepository) {
        this.registroRepository = registroRepository;
        this.criancaRepository = criancaRepository;
        this.responsavelRepository = responsavelRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public Registro registrarEntrada(RegistroRequest request) {
        return salvarRegistro(request, TipoRegistro.ENTRADA);
    }

    public Registro registrarSaida(RegistroRequest request) {
        return salvarRegistro(request, TipoRegistro.SAIDA);
    }

    private Registro salvarRegistro(RegistroRequest request, TipoRegistro tipo) {

        Crianca crianca = criancaRepository.findById(request.getCriancaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        Responsavel responsavel = responsavelRepository.findById(request.getResponsavelId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Responsável não encontrado"));

        Funcionario funcionario = funcionarioRepository.findById(request.getFuncionarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário não encontrado"));

        registroRepository.findTopByCriancaIdOrderByDataHoraDesc(crianca.getId())
                .ifPresent(ultimo -> {

                    if (tipo == TipoRegistro.ENTRADA && ultimo.getTipo() == TipoRegistro.ENTRADA) {
                        throw new RegraNegocioException("Já existe uma entrada sem saída para essa criança");
                    }

                    if (tipo == TipoRegistro.SAIDA && ultimo.getTipo() == TipoRegistro.SAIDA) {
                        throw new RegraNegocioException("Já existe uma saída registrada. Entrada não encontrada");
                    }
                });

        Registro registro = new Registro();
        registro.setCrianca(crianca);
        registro.setResponsavel(responsavel);
        registro.setFuncionario(funcionario);
        registro.setTipo(tipo);

        return registroRepository.save(registro);
    }
}
