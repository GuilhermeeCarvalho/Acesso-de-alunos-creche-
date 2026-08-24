package com.univille.AccessControl.service;

import com.univille.AccessControl.exception.RegraNegocioException;
import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Role;
import com.univille.AccessControl.repository.FuncionarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FuncionarioServiceTest {

    @Mock
    private FuncionarioRepository funcionarioRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private FuncionarioService funcionarioService;

    @Test
    void deveRejeitarEmailForaDoDominioCreche() {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome("Maria");
        funcionario.setEmail("maria@gmail.com");
        funcionario.setSenha("123456");
        funcionario.setRole(Role.FUNCIONARIO);

        assertThrows(RegraNegocioException.class, () -> funcionarioService.salvar(funcionario));
        verify(funcionarioRepository, never()).save(org.mockito.ArgumentMatchers.any(Funcionario.class));
    }

    @Test
    void deveRejeitarSenhaComMenosDeSeisDigitos() {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome("Maria");
        funcionario.setEmail("maria@creche.com");
        funcionario.setSenha("12345");
        funcionario.setRole(Role.FUNCIONARIO);

        assertThrows(RegraNegocioException.class, () -> funcionarioService.salvar(funcionario));
        verify(passwordEncoder, never()).encode("12345");
    }

    @Test
    void deveAtualizarSenhaDoFuncionario() {
        Funcionario funcionario = new Funcionario();
        funcionario.setId(10L);
        funcionario.setNome("Maria");
        funcionario.setEmail("maria@creche.com");
        funcionario.setSenha("oldpass");
        funcionario.setRole(Role.FUNCIONARIO);

        when(funcionarioRepository.findById(10L)).thenReturn(Optional.of(funcionario));
        when(passwordEncoder.encode("nova123")).thenReturn("hashNova123");
        when(funcionarioRepository.save(any(Funcionario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Funcionario atualizado = funcionarioService.atualizarSenha(10L, "nova123");

        assertEquals("hashNova123", atualizado.getSenha());
        verify(passwordEncoder).encode("nova123");
    }

    @Test
    void deveBloquearAlteracaoDaSenhaDoAdminCreche() {
        Funcionario admin = new Funcionario();
        admin.setId(1L);
        admin.setNome("Admin");
        admin.setEmail("admin@creche.com");
        admin.setSenha("oldpass");
        admin.setRole(Role.ADMIN);

        when(funcionarioRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertThrows(RegraNegocioException.class, () -> funcionarioService.atualizarSenha(1L, "nova123"));
        verify(passwordEncoder, never()).encode(any());
    }
}
