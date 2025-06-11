
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import GerenciarFornecedores from '@/components/GerenciarFornecedores';
import GerenciarOrgaos from '@/components/GerenciarOrgaos';
import GerenciarUsuarios from '@/components/GerenciarUsuarios';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { isAdmin } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'fornecedores':
        return <GerenciarFornecedores />;
      case 'orgaos':
        return <GerenciarOrgaos />;
      case 'usuarios':
        return isAdmin ? <GerenciarUsuarios /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
};

export default Index;
