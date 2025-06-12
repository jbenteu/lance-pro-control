
-- Adicionar campos de endereço e telefone aos órgãos
ALTER TABLE public.licitacao_anexos 
ALTER COLUMN licitacao_id TYPE text;

-- Criar tabela para ramos de atuação
CREATE TABLE public.ramos_atuacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir alguns ramos de atuação padrão
INSERT INTO public.ramos_atuacao (nome) VALUES 
('Tecnologia da Informação'),
('Construção Civil'),
('Alimentação e Bebidas'),
('Serviços de Limpeza'),
('Material de Escritório'),
('Equipamentos e Manutenção'),
('Consultoria'),
('Transporte e Logística'),
('Educação e Treinamento'),
('Saúde e Medicina');

-- Adicionar políticas de segurança para ramos de atuação
ALTER TABLE public.ramos_atuacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ramos de atuação são públicos para leitura" 
  ON public.ramos_atuacao 
  FOR SELECT 
  USING (true);

CREATE POLICY "Ramos de atuação podem ser inseridos publicamente" 
  ON public.ramos_atuacao 
  FOR INSERT 
  WITH CHECK (true);

-- Atualizar bucket de anexos para permitir até 40MB
UPDATE storage.buckets 
SET file_size_limit = 41943040
WHERE id = 'licitacao-anexos';
