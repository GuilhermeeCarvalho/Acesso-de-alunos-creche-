package com.univille.AccessControl.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;

@Service
public class JwtService {

    private final String SECRET =
            "minha_chave_super_secreta_com_mais_de_32_caracteres";

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String gerarToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .signWith(getKey())
                .compact();
    }

    public String extrairEmail(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean tokenValido(String token) {

        try {
            extrairEmail(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}