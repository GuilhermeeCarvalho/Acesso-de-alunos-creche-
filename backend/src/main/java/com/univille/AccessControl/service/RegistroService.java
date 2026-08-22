package com.univille.AccessControl.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.univille.AccessControl.dto.RegistroRequest;
import com.univille.AccessControl.exception.RecursoNaoEncontradoException;
import com.univille.AccessControl.exception.RegraNegocioException;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Registro;
import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.model.TipoRegistro;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.FuncionarioRepository;
import com.univille.AccessControl.repository.RegistroRepository;
import com.univille.AccessControl.repository.ResponsavelRepository;

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

    public List<Registro> listarTodos() {
        return registroRepository.findAll();
    }

    public Registro registrarEntrada(RegistroRequest request) {
        return salvarRegistro(request, TipoRegistro.ENTRADA);
    }

    public Registro registrarSaida(RegistroRequest request) {
        return salvarRegistro(request, TipoRegistro.SAIDA);
    }

    private Registro salvarRegistro(RegistroRequest request, TipoRegistro tipo) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String emailFuncionario = authentication.getName();

        Crianca crianca = criancaRepository.findById(request.getCriancaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        Responsavel responsavel = responsavelRepository.findById(request.getResponsavelId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Responsável não encontrado"));

        Funcionario funcionario = funcionarioRepository
                .findByEmail(emailFuncionario)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Funcionário não encontrado"
                        )
                );

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
        registro.setObservacao(request.getObservacao());

        return registroRepository.save(registro);
    }
}
