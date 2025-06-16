
-- Atualizar o limite do bucket para 20MB (20 * 1024 * 1024 = 20971520 bytes)
UPDATE storage.buckets 
SET file_size_limit = 20971520
WHERE id = 'licitacao-anexos';
