package com.univille.AccessControl.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private static final String SECRET =
            "validation-only-random-jwt-signing-secret-with-at-least-32-bytes";

    @Test
    void assinaETestaTokenUsandoChaveConfigurada() {
        JwtService jwtService = new JwtService(SECRET);
        String token = jwtService.gerarToken("admin@creche.com", "ADMIN");

        assertEquals("admin@creche.com", jwtService.extrairEmail(token));
        assertEquals("ADMIN", jwtService.extrairRole(token));
        assertTrue(jwtService.tokenValido(token));
    }

    @Test
    void defineExpiracaoDeOitoHoras() {
        JwtService jwtService = new JwtService(SECRET);
        Instant beforeIssue = Instant.now();
        String token = jwtService.gerarToken("admin@creche.com", "ADMIN");
        var claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertTrue(!claims.getIssuedAt().toInstant().isBefore(beforeIssue.minusSeconds(1)));
        assertEquals(Duration.ofHours(8).toSeconds(),
                Duration.between(claims.getIssuedAt().toInstant(), claims.getExpiration().toInstant()).toSeconds());
    }

    @Test
    void rejeitaTokenExpirado() {
        Instant now = Instant.now();
        String expiredToken = Jwts.builder()
                .setSubject("admin@creche.com")
                .setIssuedAt(Date.from(now.minusSeconds(60)))
                .setExpiration(Date.from(now.minusSeconds(1)))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();

        assertFalse(new JwtService(SECRET).tokenValido(expiredToken));
    }

    @Test
    void rejeitaTokenAssinadoComOutraChave() {
        JwtService issuer = new JwtService(SECRET);
        JwtService validator = new JwtService(SECRET + "-different");
        String token = issuer.gerarToken("admin@creche.com", "ADMIN");

        assertFalse(validator.tokenValido(token));
    }
}
