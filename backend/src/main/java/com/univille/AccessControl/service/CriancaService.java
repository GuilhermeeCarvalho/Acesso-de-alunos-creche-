package com.univille.AccessControl.service;

import com.univille.AccessControl.exception.RecursoNaoEncontradoException;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.RegistroRepository;
import com.univille.AccessControl.repository.ResponsavelCriancaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CriancaService {

    private final CriancaRepository criancaRepository;
    private final ResponsavelCriancaRepository responsavelCriancaRepository;
    private final RegistroRepository registroRepository;

    public CriancaService(CriancaRepository criancaRepository,
                          ResponsavelCriancaRepository responsavelCriancaRepository,
                          RegistroRepository registroRepository) {
        this.criancaRepository = criancaRepository;
        this.responsavelCriancaRepository = responsavelCriancaRepository;
        this.registroRepository = registroRepository;
    }

    public Crianca salvar(Crianca crianca) {
        return criancaRepository.save(crianca);
    }

    public List<Crianca> listarTodos() {
        return criancaRepository.findAll();
    }

    public Crianca atualizar(Long id, Crianca dadosAtualizados) {
        Crianca crianca = criancaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        crianca.setNome(dadosAtualizados.getNome());
        crianca.setTurma(dadosAtualizados.getTurma());

        return criancaRepository.save(crianca);
    }

    @Transactional
    public void remover(Long id) {
        if (!criancaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Criança não encontrada");
        }

        registroRepository.deleteByCriancaId(id);
        responsavelCriancaRepository.deleteByCriancaId(id);
        criancaRepository.deleteById(id);
    }
}