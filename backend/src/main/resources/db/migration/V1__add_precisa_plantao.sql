-- Migration: add column precisa_plantao to crianca table
ALTER TABLE crianca
ADD COLUMN IF NOT EXISTS precisa_plantao BOOLEAN NOT NULL DEFAULT FALSE;
