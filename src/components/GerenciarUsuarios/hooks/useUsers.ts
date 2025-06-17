
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      
      // Buscar usuários da tabela auth.users (via RPC se necessário) e profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Buscar roles dos usuários
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        return;
      }

      console.log('Profiles:', profiles);
      console.log('Roles:', roles);

      // Combinar dados
      const usersData = profiles?.map(profile => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          nome: profile.nome,
          role: userRole?.role || 'user',
          created_at: profile.created_at
        };
      }) || [];

      setUsers(usersData);
    } catch (err) {
      console.error('Exception fetching users:', err);
    }
  };

  const createUser = async (nome: string, email: string, senha: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: email.trim(),
        password: senha,
        user_metadata: { nome: nome.trim() },
        email_confirm: true
      });

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      console.log('User created successfully:', data);
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Exception creating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: { email?: string; password?: string }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, updates);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Exception updating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Exception deleting user:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
