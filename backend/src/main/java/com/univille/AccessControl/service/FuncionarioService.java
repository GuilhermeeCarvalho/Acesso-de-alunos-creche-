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

        if (repository.findByEmail(funcionario.getEmail()).isPresent()) {

            throw new EmailJaCadastradoException(
                    "Já existe um funcionário cadastrado com este email"
            );
        }

        funcionario.setSenha(
                passwordEncoder.encode(funcionario.getSenha())
        );

        return repository.save(funcionario);
    }

    public List<FuncionarioListDTO> listarTodos() {
        return repository.findAll().stream()
                .map(FuncionarioListDTO::fromEntity)
                .toList();
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