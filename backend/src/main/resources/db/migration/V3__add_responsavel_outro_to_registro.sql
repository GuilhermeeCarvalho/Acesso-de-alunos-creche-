ALTER TABLE registro
    ADD COLUMN IF NOT EXISTS responsavel_outro BOOLEAN;

UPDATE registro
SET responsavel_outro = FALSE
WHERE responsavel_outro IS NULL;

ALTER TABLE registro
    ALTER COLUMN responsavel_outro SET DEFAULT FALSE;

ALTER TABLE registro
    ALTER COLUMN responsavel_outro SET NOT NULL;
