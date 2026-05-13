package com.univille.AccessControl.service;

import com.univille.AccessControl.model.Funcionario;
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

        funcionario.setSenha(
                passwordEncoder.encode(funcionario.getSenha())
        );

        return repository.save(funcionario);
    }

    public List<Funcionario> listarTodos() {
        return repository.findAll();
    }
}