package com.univille.AccessControl.repository;

import com.univille.AccessControl.model.ResponsavelCrianca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponsavelCriancaRepository extends JpaRepository<ResponsavelCrianca, Long> {
    List<ResponsavelCrianca> findByCriancaId(Long criancaId);
}