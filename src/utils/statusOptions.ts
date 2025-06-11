
import { StatusLicitacao } from '@/types/licitacao';

export const STATUS_OPTIONS: StatusLicitacao[] = [
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

export const getStatusColor = (status: StatusLicitacao) => {
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

export const getStatusColorSimple = (status: StatusLicitacao) => {
  const statusColors = {
    'Proposta não Cadastrada': 'bg-red-100 text-red-800',
    'Proposta Cadastrada': 'bg-yellow-100 text-yellow-800',
    'Em Disputa': 'bg-blue-100 text-blue-800',
    'Seleção de Fornecedores': 'bg-purple-100 text-purple-800',
    'Aceita': 'bg-green-100 text-green-800',
    'Aceita e Habilitada': 'bg-green-100 text-green-800',
    'Aguardando Nota de Empenho': 'bg-orange-100 text-orange-800',
    'Aguardando Entrega': 'bg-indigo-100 text-indigo-800',
    'Entregue': 'bg-emerald-100 text-emerald-800',
    'Cancelada': 'bg-gray-100 text-gray-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};
