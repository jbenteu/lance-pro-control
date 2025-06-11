
-- Criar bucket para armazenar PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('licitacao-anexos', 'licitacao-anexos', true);

-- Criar tabela para gerenciar anexos de licitações
CREATE TABLE public.licitacao_anexos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  licitacao_id TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  caminho_arquivo TEXT NOT NULL,
  tamanho_arquivo BIGINT,
  tipo_arquivo TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar políticas de segurança para anexos
ALTER TABLE public.licitacao_anexos ENABLE ROW LEVEL SECURITY;

-- Política para visualizar anexos (público para simplificar)
CREATE POLICY "Anexos são públicos para leitura" 
  ON public.licitacao_anexos 
  FOR SELECT 
  USING (true);

-- Política para inserir anexos (público para simplificar)
CREATE POLICY "Anexos podem ser inseridos publicamente" 
  ON public.licitacao_anexos 
  FOR INSERT 
  WITH CHECK (true);

-- Política para deletar anexos (público para simplificar)
CREATE POLICY "Anexos podem ser deletados publicamente" 
  ON public.licitacao_anexos 
  FOR DELETE 
  USING (true);

-- Criar políticas para o bucket de storage
CREATE POLICY "Anexos PDFs são públicos para leitura"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'licitacao-anexos');

CREATE POLICY "Anexos PDFs podem ser inseridos publicamente"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'licitacao-anexos');

CREATE POLICY "Anexos PDFs podem ser deletados publicamente"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'licitacao-anexos');
