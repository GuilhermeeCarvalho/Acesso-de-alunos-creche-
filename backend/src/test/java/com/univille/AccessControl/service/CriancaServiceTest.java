package com.univille.AccessControl.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.RegistroRepository;
import com.univille.AccessControl.repository.ResponsavelCriancaRepository;

@ExtendWith(MockitoExtension.class)
class CriancaServiceTest {

    @Mock
    private CriancaRepository criancaRepository;

    @Mock
    private ResponsavelCriancaRepository responsavelCriancaRepository;

    @Mock
    private RegistroRepository registroRepository;

    @InjectMocks
    private CriancaService criancaService;

    @Test
    void deveAtualizarTurnoDaCriancaAoSalvarAlteracoes() {
        Crianca existente = new Crianca();
        existente.setId(1L);
        existente.setNome("Ana");
        existente.setTurma("Maternal");
        existente.setPrecisaPlantao(false);

        Crianca dadosAtualizados = new Crianca();
        dadosAtualizados.setNome("Ana");
        dadosAtualizados.setTurma("Jardim I");
        dadosAtualizados.setPrecisaPlantao(true);
        dadosAtualizados.setTurno("Vespertino");

        when(criancaRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(criancaRepository.save(any(Crianca.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Crianca resultado = criancaService.atualizar(1L, dadosAtualizados);

        assertEquals("Jardim I", resultado.getTurma());
        assertTrue(resultado.isPrecisaPlantao());
        assertEquals("Vespertino", resultado.getTurno());
    }

    @Test
    void deveRemoverDocumentoDePlantaoSemDeixarReferenciaPersistida() {
        Crianca existente = new Crianca();
        existente.setId(2L);
        existente.setNome("Bia");
        existente.setDocumentoPath("criancas/2/doc.pdf");
        existente.setDocumentoAtualizadoEm(java.time.LocalDateTime.now());
        existente.setPrecisaPlantao(true);

        when(criancaRepository.findById(2L)).thenReturn(Optional.of(existente));
        when(criancaRepository.save(any(Crianca.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Crianca resultado = criancaService.removerDocumento(2L);

        assertNull(resultado.getDocumentoPath());
        assertNull(resultado.getDocumentoAtualizadoEm());
        assertTrue(!resultado.isPrecisaPlantao());
    }
}
