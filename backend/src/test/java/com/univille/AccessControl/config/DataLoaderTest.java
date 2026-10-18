package com.univille.AccessControl.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Role;
import com.univille.AccessControl.repository.FuncionarioRepository;

@ExtendWith(MockitoExtension.class)
class DataLoaderTest {

    @Mock
    private FuncionarioRepository repository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void criaAdministradorFixoQuandoContaAindaNaoExiste() {
        when(repository.findByEmail("admin@creche.com")).thenReturn(Optional.empty());

        new DataLoader(repository, passwordEncoder, "fixed-admin-secret").run();

        ArgumentCaptor<Funcionario> funcionarioCaptor = ArgumentCaptor.forClass(Funcionario.class);
        verify(repository).findByEmail("admin@creche.com");
        verify(repository).save(funcionarioCaptor.capture());
        verifyNoMoreInteractions(repository);

        Funcionario admin = funcionarioCaptor.getValue();
        assertEquals("admin@creche.com", admin.getEmail());
        assertEquals(Role.ADMIN, admin.getRole());
        assertTrue(passwordEncoder.matches("fixed-admin-secret", admin.getSenha()));
    }

    @Test
    void atualizaSenhaApenasDaContaAdminFixa() {
        Funcionario admin = new Funcionario();
        admin.setEmail("admin@creche.com");
        admin.setSenha(passwordEncoder.encode("previous-password"));
        when(repository.findByEmail("admin@creche.com")).thenReturn(Optional.of(admin));

        new DataLoader(repository, passwordEncoder, "fixed-admin-secret").run();

        verify(repository, times(2)).findByEmail("admin@creche.com");
        verify(repository).save(admin);
        verifyNoMoreInteractions(repository);
        assertTrue(passwordEncoder.matches("fixed-admin-secret", admin.getSenha()));
    }
}
