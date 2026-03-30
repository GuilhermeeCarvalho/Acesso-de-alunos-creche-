package com.univille.AccessControl.repository;

import com.univille.AccessControl.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
}
