package com.univille.AccessControl.repository;

import com.univille.AccessControl.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findTopByCriancaIdOrderByDataHoraDesc(Long criancaId);
}
