
-- Criar enum para os tipos de roles
CREATE TYPE public.user_role AS ENUM ('superadmin', 'admin', 'user');

-- Criar tabela para roles de usuários
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seus próprios roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que superadmins vejam todos os roles
CREATE POLICY "Superadmins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- Política para permitir que superadmins insiram roles
CREATE POLICY "Superadmins can insert roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- Política para permitir que superadmins atualizem roles
CREATE POLICY "Superadmins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- Política para permitir que superadmins deletem roles
CREATE POLICY "Superadmins can delete roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- Função para verificar se um usuário tem um role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Inserir role de superadmin para o usuário joaobenteu@sistema.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'superadmin'::user_role
FROM auth.users
WHERE email = 'joaobenteu@sistema.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Atualizar a função handle_new_user para incluir role padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nome', 'Usuário'),
    new.email
  );
  
  -- Inserir role padrão de usuário
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user'::user_role);
  
  RETURN new;
END;
$$;
