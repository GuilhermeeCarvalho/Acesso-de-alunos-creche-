package com.univille.AccessControl.service;

import com.univille.AccessControl.dto.ResponsavelCriancaResponse;
import com.univille.AccessControl.dto.VinculoResponsavelRequest;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.model.ResponsavelCrianca;
import com.univille.AccessControl.model.TipoRelacao;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.ResponsavelCriancaRepository;
import com.univille.AccessControl.repository.ResponsavelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponsavelCriancaService {

    private final CriancaRepository criancaRepository;
    private final ResponsavelRepository responsavelRepository;
    private final ResponsavelCriancaRepository repository;

    public ResponsavelCriancaService(
            CriancaRepository criancaRepository,
            ResponsavelRepository responsavelRepository,
            ResponsavelCriancaRepository repository
    ) {
        this.criancaRepository = criancaRepository;
        this.responsavelRepository = responsavelRepository;
        this.repository = repository;
    }

    public void vincular(VinculoResponsavelRequest request) {

        Crianca crianca = criancaRepository.findById(
                request.getCriancaId()
        ).orElseThrow();

        Responsavel responsavel = responsavelRepository.findById(
                request.getResponsavelId()
        ).orElseThrow();

        ResponsavelCrianca vinculo = new ResponsavelCrianca();

        vinculo.setCrianca(crianca);
        vinculo.setResponsavel(responsavel);

        vinculo.setRelacao(
                TipoRelacao.valueOf(
                        request.getRelacao()
                )
        );

        repository.save(vinculo);
    }
    public List<ResponsavelCriancaResponse>
    listarResponsaveisDaCrianca(Long criancaId) {

        List<ResponsavelCrianca> vinculos =
                repository.findByCriancaId(criancaId);

        return vinculos.stream()
                .map(vinculo -> new ResponsavelCriancaResponse(

                        vinculo.getResponsavel().getId(),

                        vinculo.getResponsavel().getNome(),

                        vinculo.getResponsavel().getTelefone(),

                        vinculo.getRelacao()
                ))
                .toList();
    }
}