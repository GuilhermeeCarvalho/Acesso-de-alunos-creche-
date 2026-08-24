package com.univille.AccessControl.service;

import com.univille.AccessControl.dto.RegistroRequest;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Registro;
import com.univille.AccessControl.model.Responsavel;
import com.univille.AccessControl.model.TipoRegistro;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.FuncionarioRepository;
import com.univille.AccessControl.repository.RegistroRepository;
import com.univille.AccessControl.repository.ResponsavelRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegistroServiceTest {

    @Mock
    private RegistroRepository registroRepository;

    @Mock
    private CriancaRepository criancaRepository;

    @Mock
    private ResponsavelRepository responsavelRepository;

    @Mock
    private FuncionarioRepository funcionarioRepository;

    @InjectMocks
    private RegistroService registroService;

    @Test
    void deveSalvarObservacaoAoRegistrarMovimentacao() {
        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("funcionario@teste.com", null));

        Crianca crianca = new Crianca();
        crianca.setId(1L);

        Responsavel responsavel = new Responsavel();
        responsavel.setId(2L);

        Funcionario funcionario = new Funcionario();
        funcionario.setEmail("funcionario@teste.com");

        RegistroRequest request = new RegistroRequest();
        request.setCriancaId(1L);
        request.setResponsavelId(2L);
        request.setObservacao("Aluno chegou acompanhado de tia");

        when(criancaRepository.findById(1L)).thenReturn(Optional.of(crianca));
        when(responsavelRepository.findById(2L)).thenReturn(Optional.of(responsavel));
        when(funcionarioRepository.findByEmail("funcionario@teste.com")).thenReturn(Optional.of(funcionario));
        when(registroRepository.findTopByCriancaIdOrderByDataHoraDesc(1L)).thenReturn(Optional.empty());
        when(registroRepository.save(any(Registro.class))).thenAnswer(invocation -> invocation.getArgument(0));

        registroService.registrarEntrada(request);

        ArgumentCaptor<Registro> captor = ArgumentCaptor.forClass(Registro.class);
        verify(registroRepository).save(captor.capture());

        assertEquals("Aluno chegou acompanhado de tia", captor.getValue().getObservacao());
        assertEquals(TipoRegistro.ENTRADA, captor.getValue().getTipo());
    }

    @Test
    void deveExcluirRegistroPorId() {
        Registro registro = new Registro();
        registro.setId(7L);

        when(registroRepository.findById(7L)).thenReturn(Optional.of(registro));

        registroService.excluir(7L);

        verify(registroRepository).delete(registro);
    }
}
