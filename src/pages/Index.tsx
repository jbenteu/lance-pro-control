
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import GerenciarFornecedores from '@/components/GerenciarFornecedores';
import GerenciarOrgaos from '@/components/GerenciarOrgaos';
import GerenciarUsuarios from '@/components/GerenciarUsuarios';
import NovaLicitacao from '@/components/NovaLicitacao';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { isAdmin } = useAuth();

  const handleNovaLicitacao = () => {
    setCurrentView('nova-licitacao');
  };

  const handleVoltar = () => {
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNovaLicitacao={handleNovaLicitacao} />;
      case 'fornecedores':
        return <GerenciarFornecedores onVoltar={handleVoltar} />;
      case 'orgaos':
        return <GerenciarOrgaos onVoltar={handleVoltar} />;
      case 'usuarios':
        return isAdmin ? <GerenciarUsuarios /> : <Dashboard onNovaLicitacao={handleNovaLicitacao} />;
      case 'nova-licitacao':
        return <NovaLicitacao onVoltar={handleVoltar} />;
      default:
        return <Dashboard onNovaLicitacao={handleNovaLicitacao} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
};

export default Index;
