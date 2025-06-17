
-- Remover as políticas existentes que causam recursão
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmins can delete roles" ON public.user_roles;

-- Criar políticas mais simples que não causam recursão
CREATE POLICY "Allow authenticated users to view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para permitir que usuários com email específico (superadmin) vejam todos os roles
CREATE POLICY "Allow superadmin email to view all roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'joaobenteu@sistema.com'
  );

-- Política para permitir que superadmin insira roles
CREATE POLICY "Allow superadmin email to insert roles" 
  ON public.user_roles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'joaobenteu@sistema.com'
  );

-- Política para permitir que superadmin atualize roles
CREATE POLICY "Allow superadmin email to update roles" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'joaobenteu@sistema.com'
  );

-- Política para permitir que superadmin delete roles
CREATE POLICY "Allow superadmin email to delete roles" 
  ON public.user_roles 
  FOR DELETE 
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'joaobenteu@sistema.com'
  );
