package com.univille.AccessControl.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.model.Role;
import com.univille.AccessControl.repository.FuncionarioRepository;

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

        String newAdminPassword = "Cr3ch3@N3id3";

        if (!existeAdmin) {

            Funcionario admin = new Funcionario();

            admin.setNome("Administrador");
            admin.setEmail("admin@creche.com");

            admin.setSenha(
                    passwordEncoder.encode(newAdminPassword)
            );

            admin.setRole(Role.ADMIN);

            repository.save(admin);

            System.out.println("ADMIN PADRÃO CRIADO");
        } else {
            // Atualiza a senha do admin para uma senha conhecida em ambiente de desenvolvimento
            repository.findByEmail("admin@creche.com").ifPresent(admin -> {
                admin.setSenha(passwordEncoder.encode(newAdminPassword));
                repository.save(admin);
                System.out.println("ADMIN_PASSWORD_RESET");
            });
        }
    }
}