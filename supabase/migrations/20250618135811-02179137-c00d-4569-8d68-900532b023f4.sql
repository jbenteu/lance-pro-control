
-- First, let's drop ALL existing policies on both tables to ensure a clean state
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow superadmin email to view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow superadmin email to insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow superadmin email to update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow superadmin email to delete roles" ON public.user_roles;

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can delete profiles" ON public.profiles;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.is_superadmin();

-- Create the security definer function to check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (SELECT email FROM auth.users WHERE id = auth.uid()) = 'joaobenteu@sistema.com';
$$;

-- Create new policies for user_roles table
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (public.is_superadmin());

CREATE POLICY "Superadmin can insert roles" 
  ON public.user_roles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Superadmin can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  TO authenticated
  USING (public.is_superadmin());

CREATE POLICY "Superadmin can delete roles" 
  ON public.user_roles 
  FOR DELETE 
  TO authenticated
  USING (public.is_superadmin());

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Superadmin can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (public.is_superadmin());

CREATE POLICY "Superadmin can insert profiles" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Superadmin can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (public.is_superadmin());

CREATE POLICY "Superadmin can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  TO authenticated
  USING (public.is_superadmin());
