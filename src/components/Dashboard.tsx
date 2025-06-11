
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, FileText, Calendar, MapPin, Settings } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { StatusLicitacao } from '@/types/licitacao';

interface DashboardProps {
  onNovaLicitacao: () => void;
  onGerenciarCotacoes: (licitacaoId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNovaLicitacao, onGerenciarCotacoes }) => {
  const { licitacoes } = useLicitacao();
  const [filtroStatus, setFiltroStatus] = useState<StatusLicitacao | 'todos'>('todos');
  const [buscaTexto, setBuscaTexto] = useState('');

  const getStatusColor = (status: StatusLicitacao) => {
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

  const licitacoesFiltradas = licitacoes.filter(licitacao => {
    const matchStatus = filtroStatus === 'todos' || licitacao.status === filtroStatus;
    const matchTexto = licitacao.numeroAviso.toLowerCase().includes(buscaTexto.toLowerCase()) ||
                       licitacao.descricao.toLowerCase().includes(buscaTexto.toLowerCase()) ||
                       licitacao.orgaoResponsavel.nome.toLowerCase().includes(buscaTexto.toLowerCase());
    return matchStatus && matchTexto;
  });

  const totalLicitacoes = licitacoes.length;
  const licitacoesAbertas = licitacoes.filter(l => ['Proposta não Cadastrada', 'Proposta Cadastrada', 'Em Disputa'].includes(l.status)).length;
  const licitacoesGanhas = licitacoes.filter(l => ['Aceita', 'Aceita e Habilitada', 'Aguardando Nota de Empenho', 'Aguardando Entrega', 'Entregue'].includes(l.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Licitações</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas licitações</p>
        </div>
        <Button onClick={onNovaLicitacao} className="bg-business-600 hover:bg-business-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Licitação
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Licitações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLicitacoes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licitações Abertas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{licitacoesAbertas}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licitações Ganhas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{licitacoesGanhas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, descrição ou órgão..."
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={filtroStatus} onValueChange={(value) => setFiltroStatus(value as StatusLicitacao | 'todos')}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="Proposta não Cadastrada">Proposta não Cadastrada</SelectItem>
                  <SelectItem value="Proposta Cadastrada">Proposta Cadastrada</SelectItem>
                  <SelectItem value="Em Disputa">Em Disputa</SelectItem>
                  <SelectItem value="Seleção de Fornecedores">Seleção de Fornecedores</SelectItem>
                  <SelectItem value="Aceita">Aceita</SelectItem>
                  <SelectItem value="Aceita e Habilitada">Aceita e Habilitada</SelectItem>
                  <SelectItem value="Aguardando Nota de Empenho">Aguardando Nota de Empenho</SelectItem>
                  <SelectItem value="Aguardando Entrega">Aguardando Entrega</SelectItem>
                  <SelectItem value="Entregue">Entregue</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Licitações */}
      <div className="space-y-4">
        {licitacoesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma licitação encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {licitacoes.length === 0 
                  ? 'Comece criando sua primeira licitação'
                  : 'Tente ajustar os filtros ou criar uma nova licitação'
                }
              </p>
              <Button onClick={onNovaLicitacao} className="bg-business-600 hover:bg-business-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Licitação
              </Button>
            </CardContent>
          </Card>
        ) : (
          licitacoesFiltradas.map((licitacao) => (
            <Card key={licitacao.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Aviso Nº {licitacao.numeroAviso}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {licitacao.modalidade} - {licitacao.orgaoResponsavel.nome}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(licitacao.status)}>
                      {licitacao.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGerenciarCotacoes(licitacao.id)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Cotações
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Descrição:</h4>
                    <p className="text-sm text-muted-foreground">{licitacao.descricao}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">UASG:</span> {licitacao.orgaoResponsavel.uasg}
                    </div>
                    <div>
                      <span className="font-medium">Local de Entrega:</span> {licitacao.localEntrega}
                    </div>
                    <div>
                      <span className="font-medium">Fim das Propostas:</span> {new Date(licitacao.dataFimRecebiemntoPropostas).toLocaleString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Data da Sessão:</span> {new Date(licitacao.dataSessao).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Itens:</span> {licitacao.itens.length} item(s)
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
