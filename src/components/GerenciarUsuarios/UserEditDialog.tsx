
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from './types';

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (userId: string, updates: { email?: string; password?: string }) => Promise<{ success: boolean }>;
  loading: boolean;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ 
  user, 
  open, 
  onOpenChange, 
  onUpdateUser, 
  loading 
}) => {
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editSenha, setEditSenha] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      setEditEmail(user.email);
      setEditSenha('');
      setError('');
    }
  }, [user]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');

    try {
      const updates: any = {};

      if (editEmail !== user.email) {
        updates.email = editEmail.trim();
      }

      if (editSenha && editSenha.length >= 6) {
        updates.password = editSenha;
      }

      if (Object.keys(updates).length === 0) {
        setError('Nenhuma alteração foi feita.');
        return;
      }

      await onUpdateUser(user.id, updates);

      toast({
        title: "Usuário atualizado com sucesso!",
        description: `As informações do usuário foram atualizadas.`,
      });

      onOpenChange(false);
    } catch (err) {
      console.error('Exception updating user:', err);
      setError('Erro inesperado ao atualizar usuário.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Altere o email e/ou senha do usuário
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdateUser} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="editEmail" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="editEmail"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="editSenha" className="text-sm font-medium text-gray-700">
              Nova Senha (opcional)
            </label>
            <div className="relative">
              <Input
                id="editSenha"
                type={showEditPassword ? 'text' : 'password'}
                value={editSenha}
                onChange={(e) => setEditSenha(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowEditPassword(!showEditPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-600">Deixe em branco para manter a senha atual</p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
