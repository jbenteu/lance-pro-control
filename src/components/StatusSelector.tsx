
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusLicitacao } from '@/types/licitacao';

interface StatusSelectorProps {
  currentStatus: StatusLicitacao;
  onStatusChange: (status: StatusLicitacao) => void;
  onClose: () => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onStatusChange, onClose }) => {
  const statusOptions: StatusLicitacao[] = [
    'Proposta não Cadastrada',
    'Proposta Cadastrada',
    'Em Disputa',
    'Seleção de Fornecedores',
    'Aceita',
    'Aceita e Habilitada',
    'Aguardando Nota de Empenho',
    'Aguardando Entrega',
    'Entregue',
    'Cancelada'
  ];

  const getStatusColor = (status: StatusLicitacao) => {
    const statusColors = {
      'Proposta não Cadastrada': 'bg-red-100 text-red-800 hover:bg-red-200',
      'Proposta Cadastrada': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'Em Disputa': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Seleção de Fornecedores': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Aceita': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Aceita e Habilitada': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Aguardando Nota de Empenho': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      'Aguardando Entrega': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      'Entregue': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      'Cancelada': 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Card className="w-64 bg-white shadow-lg border">
          <CardContent className="p-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium mb-2">Alterar Status</h4>
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-xs px-2 py-1 h-auto ${
                    status === currentStatus ? 'ring-2 ring-blue-500' : ''
                  } ${getStatusColor(status)}`}
                  onClick={() => onStatusChange(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusSelector;
