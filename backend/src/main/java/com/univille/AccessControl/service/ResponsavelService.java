package com.univille.AccessControl.service;

import com.univille.AccessControl.exception.RecursoNaoEncontradoException;
import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.repository.RegistroRepository;
import com.univille.AccessControl.repository.ResponsavelCriancaRepository;
import com.univille.AccessControl.repository.ResponsavelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResponsavelService {

    private final ResponsavelRepository responsavelRepository;
    private final ResponsavelCriancaRepository responsavelCriancaRepository;
    private final RegistroRepository registroRepository;

    public ResponsavelService(ResponsavelRepository responsavelRepository,
                              ResponsavelCriancaRepository responsavelCriancaRepository,
                              RegistroRepository registroRepository) {
        this.responsavelRepository = responsavelRepository;
        this.responsavelCriancaRepository = responsavelCriancaRepository;
        this.registroRepository = registroRepository;
    }

    public Responsavel salvar(Responsavel responsavel) {
        return responsavelRepository.save(responsavel);
    }

    public List<Responsavel> listarTodos() {
        return responsavelRepository.findAll();
    }

    public Responsavel atualizar(Long id, Responsavel dadosAtualizados) {
        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Responsável não encontrado"));

        responsavel.setNome(dadosAtualizados.getNome());
        responsavel.setTelefone(dadosAtualizados.getTelefone());

        return responsavelRepository.save(responsavel);
    }

    @Transactional
    public void remover(Long id) {
        if (!responsavelRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Responsável não encontrado");
        }

        registroRepository.deleteByResponsavelId(id);
        responsavelCriancaRepository.deleteByResponsavelId(id);
        responsavelRepository.deleteById(id);
    }
}