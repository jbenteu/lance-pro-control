
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const InfoCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Informações
        </CardTitle>
        <CardDescription>
          Apenas superadministradores podem gerenciar usuários
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          <p>• O email deve ser único no sistema</p>
          <p>• A senha deve ter pelo menos 6 caracteres</p>
          <p>• Os usuários criados poderão fazer login imediatamente</p>
          <p>• Novos usuários recebem o role padrão de "user"</p>
          <p>• Superadministradores não podem ser excluídos</p>
        </div>
      </CardContent>
    </Card>
  );
};
