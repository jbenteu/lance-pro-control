
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import GerenciarFornecedores from '@/components/GerenciarFornecedores';
import GerenciarOrgaos from '@/components/GerenciarOrgaos';
import GerenciarUsuarios from '@/components/GerenciarUsuarios';
import NovaLicitacao from '@/components/NovaLicitacao';
import GerenciarCotacoes from '@/components/GerenciarCotacoes';
import VisualizarProcessos from '@/components/VisualizarProcessos';
import { useAuth } from '@/contexts/AuthContext';
import { useLicitacao } from '@/contexts/LicitacaoContext';

const Index: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [licitacaoSelecionada, setLicitacaoSelecionada] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { licitacoes } = useLicitacao();

  const handleNovaLicitacao = () => {
    setCurrentView('nova-licitacao');
  };

  const handleVoltar = () => {
    setCurrentView('dashboard');
    setLicitacaoSelecionada(null);
  };

  const handleGerenciarCotacoes = (licitacaoId: string) => {
    setLicitacaoSelecionada(licitacaoId);
    setCurrentView('gerenciar-cotacoes');
  };

  const handleVisualizarProcessos = () => {
    setCurrentView('visualizar-processos');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNovaLicitacao={handleNovaLicitacao} 
            onGerenciarCotacoes={handleGerenciarCotacoes}
            onVisualizarProcessos={handleVisualizarProcessos}
          />
        );
      case 'fornecedores':
        return <GerenciarFornecedores onVoltar={handleVoltar} />;
      case 'orgaos':
        return <GerenciarOrgaos onVoltar={handleVoltar} />;
      case 'usuarios':
        return isAdmin ? <GerenciarUsuarios /> : <Dashboard onNovaLicitacao={handleNovaLicitacao} onGerenciarCotacoes={handleGerenciarCotacoes} onVisualizarProcessos={handleVisualizarProcessos} />;
      case 'nova-licitacao':
        return <NovaLicitacao onVoltar={handleVoltar} />;
      case 'gerenciar-cotacoes':
        if (licitacaoSelecionada) {
          const licitacao = licitacoes.find(l => l.id === licitacaoSelecionada);
          if (licitacao) {
            return <GerenciarCotacoes licitacao={licitacao} onVoltar={handleVoltar} />;
          }
        }
        return (
          <Dashboard 
            onNovaLicitacao={handleNovaLicitacao} 
            onGerenciarCotacoes={handleGerenciarCotacoes}
            onVisualizarProcessos={handleVisualizarProcessos}
          />
        );
      case 'visualizar-processos':
        return <VisualizarProcessos onVoltar={handleVoltar} onGerenciarCotacoes={handleGerenciarCotacoes} />;
      default:
        return (
          <Dashboard 
            onNovaLicitacao={handleNovaLicitacao} 
            onGerenciarCotacoes={handleGerenciarCotacoes}
            onVisualizarProcessos={handleVisualizarProcessos}
          />
        );
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
};

export default Index;
