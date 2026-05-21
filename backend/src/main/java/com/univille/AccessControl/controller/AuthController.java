package com.univille.AccessControl.controller;

import java.io.BufferedReader;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.univille.AccessControl.dto.LoginRequest;
import com.univille.AccessControl.dto.LoginResponse;
import com.univille.AccessControl.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Rotas públicas de login e emissão de token JWT")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @Operation(summary = "Realiza login", description = "Aceita credenciais em JSON ou form-urlencoded e retorna um JWT quando válidas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "400", description = "Corpo da requisição inválido"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    @RequestBody(
            required = true,
            description = "Credenciais do usuário",
            content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = LoginRequest.class)),
                    @Content(mediaType = "application/x-www-form-urlencoded", schema = @Schema(implementation = LoginRequest.class))
            }
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(HttpServletRequest servletRequest) throws Exception {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = servletRequest.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String body = sb.toString();

        LoginRequest request = new LoginRequest();

        if (body != null && !body.isEmpty()) {
            String trimmed = body.trim();
            if (trimmed.startsWith("{")) {
                // naive JSON parse: extract values for email and senha
                String emailVal = extractJsonValue(trimmed, "email");
                String senhaVal = extractJsonValue(trimmed, "senha");
                request.setEmail(emailVal);
                request.setSenha(senhaVal);
            } else {
                // assume url-encoded form
                Map<String, String> params = Arrays.stream(body.split("&"))
                        .map(s -> s.split("=", 2))
                        .collect(Collectors.toMap(a -> URLDecoder.decode(a[0], StandardCharsets.UTF_8), a -> a.length > 1 ? URLDecoder.decode(a[1], StandardCharsets.UTF_8) : ""));

                request.setEmail(params.get("email"));
                request.setSenha(params.get("senha"));
            }
        }

        if (request.getEmail() == null || request.getSenha() == null) {
            throw new IllegalArgumentException("Corpo da requisição inválido");
        }

        return ResponseEntity.ok(service.login(request));
    }

    private String extractJsonValue(String json, String key) {
        int keyIdx = json.indexOf("\"" + key + "\"");
        if (keyIdx == -1) return null;
        int colonIdx = json.indexOf(':', keyIdx);
        if (colonIdx == -1) return null;
        int quoteStart = json.indexOf('"', colonIdx);
        if (quoteStart == -1) return null;
        int quoteEnd = json.indexOf('"', quoteStart + 1);
        if (quoteEnd == -1) return null;
        return json.substring(quoteStart + 1, quoteEnd);
    }
}