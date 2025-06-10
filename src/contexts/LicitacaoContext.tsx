
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Licitacao, Fornecedor, Orgao } from '@/types/licitacao';

interface LicitacaoContextType {
  licitacoes: Licitacao[];
  fornecedores: Fornecedor[];
  orgaos: Orgao[];
  addLicitacao: (licitacao: Licitacao) => void;
  updateLicitacao: (id: string, licitacao: Partial<Licitacao>) => void;
  deleteLicitacao: (id: string) => void;
  addFornecedor: (fornecedor: Fornecedor) => void;
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => void;
  deleteFornecedor: (id: string) => void;
  addOrgao: (orgao: Orgao) => void;
  updateOrgao: (id: string, orgao: Partial<Orgao>) => void;
  deleteOrgao: (id: string) => void;
}

const LicitacaoContext = createContext<LicitacaoContextType | undefined>(undefined);

export const useLicitacao = () => {
  const context = useContext(LicitacaoContext);
  if (!context) {
    throw new Error('useLicitacao must be used within a LicitacaoProvider');
  }
  return context;
};

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Dados iniciais de exemplo
const orgaosIniciais: Orgao[] = [
  { id: '1', nome: 'Prefeitura Municipal', uasg: '123456' },
  { id: '2', nome: 'Governo do Estado', uasg: '654321' },
  { id: '3', nome: 'Ministério da Saúde', uasg: '789123' },
];

const fornecedoresIniciais: Fornecedor[] = [
  {
    id: '1',
    empresa: 'Tech Solutions Ltda',
    ramoAtuacao: 'Tecnologia',
    uf: 'SP',
    nomeContato: 'João Silva',
    telefone: '(11) 98765-4321',
    whatsapp: true,
    email: 'joao@techsolutions.com',
    site: 'www.techsolutions.com',
    cnpj: '12.345.678/0001-90'
  },
  {
    id: '2',
    empresa: 'Materiais Express',
    ramoAtuacao: 'Materiais de Construção',
    uf: 'RJ',
    nomeContato: 'Maria Santos',
    telefone: '(21) 91234-5678',
    whatsapp: false,
    email: 'maria@materiaisexpress.com',
    cnpj: '98.765.432/0001-10'
  }
];

export const LicitacaoProvider = ({ children }: { children: ReactNode }) => {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(fornecedoresIniciais);
  const [orgaos, setOrgaos] = useState<Orgao[]>(orgaosIniciais);

  const addLicitacao = (licitacao: Licitacao) => {
    setLicitacoes(prev => [...prev, licitacao]);
  };

  const updateLicitacao = (id: string, updatedLicitacao: Partial<Licitacao>) => {
    setLicitacoes(prev => prev.map(licitacao => 
      licitacao.id === id ? { ...licitacao, ...updatedLicitacao } : licitacao
    ));
  };

  const deleteLicitacao = (id: string) => {
    setLicitacoes(prev => prev.filter(licitacao => licitacao.id !== id));
  };

  const addFornecedor = (fornecedor: Fornecedor) => {
    setFornecedores(prev => [...prev, fornecedor]);
  };

  const updateFornecedor = (id: string, updatedFornecedor: Partial<Fornecedor>) => {
    setFornecedores(prev => prev.map(fornecedor => 
      fornecedor.id === id ? { ...fornecedor, ...updatedFornecedor } : fornecedor
    ));
  };

  const deleteFornecedor = (id: string) => {
    setFornecedores(prev => prev.filter(fornecedor => fornecedor.id !== id));
  };

  const addOrgao = (orgao: Orgao) => {
    setOrgaos(prev => [...prev, orgao]);
  };

  const updateOrgao = (id: string, updatedOrgao: Partial<Orgao>) => {
    setOrgaos(prev => prev.map(orgao => 
      orgao.id === id ? { ...orgao, ...updatedOrgao } : orgao
    ));
  };

  const deleteOrgao = (id: string) => {
    setOrgaos(prev => prev.filter(orgao => orgao.id !== id));
  };

  return (
    <LicitacaoContext.Provider value={{
      licitacoes,
      fornecedores,
      orgaos,
      addLicitacao,
      updateLicitacao,
      deleteLicitacao,
      addFornecedor,
      updateFornecedor,
      deleteFornecedor,
      addOrgao,
      updateOrgao,
      deleteOrgao
    }}>
      {children}
    </LicitacaoContext.Provider>
  );
};
