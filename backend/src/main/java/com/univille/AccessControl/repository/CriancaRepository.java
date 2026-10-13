package com.univille.AccessControl.repository;

import com.univille.AccessControl.model.Crianca;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CriancaRepository extends JpaRepository<Crianca, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT crianca FROM Crianca crianca WHERE crianca.id = :id")
    java.util.Optional<Crianca> findByIdForUpdate(@Param("id") Long id);
}
