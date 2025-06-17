
import React, { useState } from 'react';
import { UserCreateDialog } from './UserCreateDialog';
import { UserEditDialog } from './UserEditDialog';
import { UserTable } from './UserTable';
import { InfoCard } from './InfoCard';
import { useUsers } from './hooks/useUsers';
import { User } from './types';

const GerenciarUsuarios: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
          <p className="text-gray-600">Gerencie usuários do sistema</p>
        </div>
        
        <UserCreateDialog onCreateUser={createUser} loading={loading} />
      </div>

      <UserTable 
        users={users} 
        onEditUser={handleEditUser} 
        onDeleteUser={deleteUser} 
      />

      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={handleCloseEditDialog}
        onUpdateUser={updateUser}
        loading={loading}
      />

      <InfoCard />
    </div>
  );
};

export default GerenciarUsuarios;
