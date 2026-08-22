-- Migration: add documentoPath and documentoAtualizadoEm to Crianca
ALTER TABLE crianca
ADD COLUMN documento_path VARCHAR(1024),
ADD COLUMN documento_atualizado_em TIMESTAMP,
ADD COLUMN turno VARCHAR(50);
