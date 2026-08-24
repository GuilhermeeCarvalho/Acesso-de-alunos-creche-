package com.univille.AccessControl.service;

import com.univille.AccessControl.exception.EmailJaCadastradoException;
import com.univille.AccessControl.exception.RecursoNaoEncontradoException;
import com.univille.AccessControl.exception.RegraNegocioException;
import com.univille.AccessControl.dto.FuncionarioListDTO;
import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Role;
import com.univille.AccessControl.repository.FuncionarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    public FuncionarioService(FuncionarioRepository repository,
                              BCryptPasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Funcionario salvar(Funcionario funcionario) {
        String email = funcionario.getEmail() == null ? "" : funcionario.getEmail().trim();
        String senha = funcionario.getSenha() == null ? "" : funcionario.getSenha();

        if (email.isBlank() || !email.toLowerCase().endsWith("@creche.com")) {
            throw new RegraNegocioException("O e-mail precisa terminar com @creche.com");
        }

        if (senha.length() < 6) {
            throw new RegraNegocioException("A senha precisa ter pelo menos 6 dígitos");
        }

        if (repository.findByEmail(email).isPresent()) {
            throw new EmailJaCadastradoException(
                    "Já existe um funcionário cadastrado com este email"
            );
        }

        funcionario.setEmail(email);
        funcionario.setSenha(passwordEncoder.encode(senha));

        return repository.save(funcionario);
    }

    public List<FuncionarioListDTO> listarTodos() {
        return repository.findAll().stream()
                .map(FuncionarioListDTO::fromEntity)
                .toList();
    }

    public Funcionario atualizarSenha(Long id, String novaSenha) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Funcionário não encontrado"
                ));

        if ("admin@creche.com".equalsIgnoreCase(funcionario.getEmail())) {
            throw new RegraNegocioException("Este usuário não pode ser alterado por esta operação");
        }

        if (novaSenha == null || novaSenha.trim().isEmpty()) {
            throw new RegraNegocioException("A senha é obrigatória");
        }

        if (novaSenha.trim().length() < 6) {
            throw new RegraNegocioException("A senha precisa ter pelo menos 6 dígitos");
        }

        funcionario.setSenha(passwordEncoder.encode(novaSenha.trim()));
        return repository.save(funcionario);
    }

    public void excluir(Long id) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Funcionário não encontrado"
                ));

        if (funcionario.getRole() == Role.ADMIN && repository.countByRole(Role.ADMIN) <= 1) {
            throw new RegraNegocioException("Não é possível excluir o único administrador do sistema");
        }

        repository.delete(funcionario);
    }
}