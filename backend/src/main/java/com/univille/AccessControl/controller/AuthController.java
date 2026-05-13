package com.univille.AccessControl.controller;

import com.univille.AccessControl.dto.LoginRequest;
import com.univille.AccessControl.dto.LoginResponse;
import com.univille.AccessControl.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                service.login(request)
        );
    }
}