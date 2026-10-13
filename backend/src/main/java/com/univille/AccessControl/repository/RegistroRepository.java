package com.univille.AccessControl.repository;

import com.univille.AccessControl.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findTopByCriancaIdOrderByDataHoraDesc(Long criancaId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Registro")
    void deleteAllRegistros();

    void deleteByCriancaId(Long criancaId);

    void deleteByResponsavelId(Long responsavelId);
}
