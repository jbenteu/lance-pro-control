
import React, { useState } from 'react';
import { LicitacaoProvider } from '@/contexts/LicitacaoContext';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import NovaLicitacao from '@/components/NovaLicitacao';
import GerenciarFornecedores from '@/components/GerenciarFornecedores';
import GerenciarOrgaos from '@/components/GerenciarOrgaos';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNovaLicitacao={() => setCurrentView('nova-licitacao')} />;
      case 'nova-licitacao':
        return <NovaLicitacao onVoltar={() => setCurrentView('dashboard')} />;
      case 'fornecedores':
        return <GerenciarFornecedores onVoltar={() => setCurrentView('dashboard')} />;
      case 'orgaos':
        return <GerenciarOrgaos onVoltar={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNovaLicitacao={() => setCurrentView('nova-licitacao')} />;
    }
  };

  return (
    <LicitacaoProvider>
      <Layout currentView={currentView} onNavigate={handleNavigate}>
        {renderCurrentView()}
      </Layout>
    </LicitacaoProvider>
  );
};

export default Index;
