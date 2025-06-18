
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      
      // Buscar usuários da tabela profiles
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
      console.log('Creating user via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { nome, email, senha }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw error;
      }

      if (data.error) {
        console.error('Error creating user:', data.error);
        throw new Error(data.error);
      }

      console.log('User created successfully via Edge Function:', data);
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
      console.log('Updating user via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('update-user', {
        body: { userId, updates }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw error;
      }

      if (data.error) {
        console.error('Error updating user:', data.error);
        throw new Error(data.error);
      }

      console.log('User updated successfully via Edge Function:', data);
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
      console.log('Deleting user via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw error;
      }

      if (data.error) {
        console.error('Error deleting user:', data.error);
        throw new Error(data.error);
      }

      console.log('User deleted successfully via Edge Function:', data);
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
