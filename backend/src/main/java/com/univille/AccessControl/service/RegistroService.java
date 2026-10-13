package com.univille.AccessControl.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public void excluir(Long id) {
        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Registro não encontrado"));

        registroRepository.delete(registro);
    }

    @Transactional
    public void excluirTodos() {
        registroRepository.deleteAllRegistros();
    }

    public Registro registrarEntrada(RegistroRequest request) {
        return salvarRegistro(request, TipoRegistro.ENTRADA);
    }

    public Registro registrarSaida(RegistroRequest request) {
        return salvarRegistro(request, TipoRegistro.SAIDA);
    }

    private Registro salvarRegistro(RegistroRequest request, TipoRegistro tipo) {
        if (request.isResponsavelOutro()
                && (request.getObservacao() == null || request.getObservacao().isBlank())) {
            throw new RegraNegocioException("Informe o nome da pessoa que entregou ou buscou o aluno.");
        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String emailFuncionario = authentication.getName();

        Crianca crianca = criancaRepository.findById(request.getCriancaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        Responsavel responsavel = null;
        if (!request.isResponsavelOutro()) {
            if (request.getResponsavelId() == null) {
                throw new RegraNegocioException("Selecione um responsável ou Outro.");
            }
            responsavel = responsavelRepository.findById(request.getResponsavelId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Responsável não encontrado"));
        }

        Funcionario funcionario = funcionarioRepository
                .findByEmail(emailFuncionario)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Funcionário não encontrado"
                        )
                );

        var ultimoRegistro = registroRepository.findTopByCriancaIdOrderByDataHoraDesc(crianca.getId());
        if (tipo == TipoRegistro.SAIDA && ultimoRegistro.isEmpty()) {
            throw new RegraNegocioException("Não é possível registrar a saída sem uma entrada registrada.");
        }

        ultimoRegistro.ifPresent(ultimo -> {
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
        registro.setResponsavelOutro(request.isResponsavelOutro());
        registro.setFuncionario(funcionario);
        registro.setTipo(tipo);
        registro.setObservacao(request.getObservacao());

        return registroRepository.save(registro);
    }
}
