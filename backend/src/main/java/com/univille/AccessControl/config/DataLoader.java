package com.univille.AccessControl.config;

import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Role;
import com.univille.AccessControl.repository.FuncionarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final FuncionarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataLoader(FuncionarioRepository repository,
                      BCryptPasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        boolean existeAdmin =
                repository.findByEmail("admin@creche.com").isPresent();

        if (!existeAdmin) {

            Funcionario admin = new Funcionario();

            admin.setNome("Administrador");
            admin.setEmail("admin@creche.com");

            admin.setSenha(
                    passwordEncoder.encode("123456")
            );

            admin.setRole(Role.ADMIN);

            repository.save(admin);

            System.out.println("ADMIN PADRÃO CRIADO");
        }
    }
}