package com.univille.AccessControl.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.univille.AccessControl.dto.VinculoResponsavelRequest;
import com.univille.AccessControl.exception.RegraNegocioException;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.model.ResponsavelCrianca;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.ResponsavelCriancaRepository;
import com.univille.AccessControl.repository.ResponsavelRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ResponsavelCriancaServiceTest {

    @Mock
    private CriancaRepository criancaRepository;

    @Mock
    private ResponsavelRepository responsavelRepository;

    @Mock
    private ResponsavelCriancaRepository vinculoRepository;

    @InjectMocks
    private ResponsavelCriancaService service;

    @Test
    void deveRecusarMaisDeTresResponsaveisParaUmAluno() {
        Crianca crianca = new Crianca();
        crianca.setId(1L);
        VinculoResponsavelRequest request = new VinculoResponsavelRequest();
        request.setCriancaId(1L);
        request.setResponsavelId(4L);
        request.setRelacao("PAI");

        when(criancaRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(crianca));
        when(vinculoRepository.findByCriancaId(1L)).thenReturn(List.of(
                new ResponsavelCrianca(),
                new ResponsavelCrianca(),
                new ResponsavelCrianca()
        ));

        assertThrows(RegraNegocioException.class, () -> service.vincular(request));

        verify(vinculoRepository, never()).save(any(ResponsavelCrianca.class));
    }
}
