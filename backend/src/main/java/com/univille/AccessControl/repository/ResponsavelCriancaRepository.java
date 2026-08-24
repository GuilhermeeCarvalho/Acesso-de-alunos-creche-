package com.univille.AccessControl.repository;

import com.univille.AccessControl.model.ResponsavelCrianca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResponsavelCriancaRepository extends JpaRepository<ResponsavelCrianca, Long> {
    List<ResponsavelCrianca> findByCriancaId(Long criancaId);

    void deleteByCriancaId(Long criancaId);

    void deleteByResponsavelId(Long responsavelId);

    @Modifying
    @Transactional
    @Query("UPDATE ResponsavelCrianca rc SET rc.relacao = :relacao WHERE rc.crianca.id = :criancaId AND rc.responsavel.id = :responsavelId")
    void updateRelacaoByCriancaIdAndResponsavelId(
            @Param("criancaId") Long criancaId,
            @Param("responsavelId") Long responsavelId,
            @Param("relacao") com.univille.AccessControl.model.TipoRelacao relacao
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM ResponsavelCrianca rc WHERE rc.crianca.id = :criancaId AND rc.responsavel.id = :responsavelId")
    void deleteByCriancaIdAndResponsavelId(@Param("criancaId") Long criancaId, @Param("responsavelId") Long responsavelId);
}