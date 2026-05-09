package com.univille.AccessControl.service;

import com.univille.AccessControl.dto.LoginRequest;
import com.univille.AccessControl.dto.LoginResponse;
import com.univille.AccessControl.exception.RegraNegocioException;
import com.univille.AccessControl.model.Funcionario;
import com.univille.AccessControl.repository.FuncionarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final FuncionarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(FuncionarioRepository repository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        Funcionario funcionario = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RegraNegocioException("Email ou senha inválidos"));

        boolean senhaCorreta = passwordEncoder.matches(
                request.getSenha(),
                funcionario.getSenha()
        );

        if (!senhaCorreta) {
            throw new RegraNegocioException("Email ou senha inválidos");
        }

        String token = jwtService.gerarToken(
                funcionario.getEmail(),
                funcionario.getRole().name()
        );

        return new LoginResponse(token);
    }
}