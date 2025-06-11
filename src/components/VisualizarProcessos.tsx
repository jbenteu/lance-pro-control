
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Filter, Settings, Eye, Paperclip } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { StatusLicitacao } from '@/types/licitacao';
import StatusSelector from './StatusSelector';
import AnexosPDF from './AnexosPDF';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { STATUS_OPTIONS, getStatusColorSimple } from '@/utils/statusOptions';

interface VisualizarProcessosProps {
  onVoltar: () => void;
  onGerenciarCotacoes: (licitacaoId: string) => void;
}

const VisualizarProcessos: React.FC<VisualizarProcessosProps> = ({ onVoltar, onGerenciarCotacoes }) => {
  const { licitacoes, updateLicitacao } = useLicitacao();
  const [filtroStatus, setFiltroStatus] = useState<StatusLicitacao | 'todos'>('todos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [statusSelectorOpen, setStatusSelectorOpen] = useState<string | null>(null);
  const [visualizacao, setVisualizacao] = useState<'cards' | 'tabela'>('cards');
  const [anexosDialogOpen, setAnexosDialogOpen] = useState<string | null>(null);

  const handleStatusChange = (licitacaoId: string, novoStatus: StatusLicitacao) => {
    updateLicitacao(licitacaoId, { status: novoStatus });
    setStatusSelectorOpen(null);
  };

  const licitacoesFiltradas = licitacoes.filter(licitacao => {
    const matchStatus = filtroStatus === 'todos' || licitacao.status === filtroStatus;
    const matchTexto = licitacao.numeroAviso.toLowerCase().includes(buscaTexto.toLowerCase()) ||
                       licitacao.descricao.toLowerCase().includes(buscaTexto.toLowerCase()) ||
                       licitacao.orgaoResponsavel.nome.toLowerCase().includes(buscaTexto.toLowerCase());
    return matchStatus && matchTexto;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Todos os Processos</h1>
            <p className="text-muted-foreground">Visualização completa de todas as licitações</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={visualizacao} onValueChange={(value) => setVisualizacao(value as 'cards' | 'tabela')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cards">Cards</SelectItem>
              <SelectItem value="tabela">Tabela</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{licitacoesFiltradas.length}</div>
            <p className="text-sm text-muted-foreground">Total Filtrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {licitacoesFiltradas.filter(l => ['Proposta não Cadastrada', 'Proposta Cadastrada', 'Em Disputa'].includes(l.status)).length}
            </div>
            <p className="text-sm text-muted-foreground">Abertas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {licitacoesFiltradas.filter(l => ['Aceita', 'Aceita e Habilitada', 'Aguardando Nota de Empenho', 'Aguardando Entrega', 'Entregue'].includes(l.status)).length}
            </div>
            <p className="text-sm text-muted-foreground">Ganhas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {licitacoesFiltradas.filter(l => l.status === 'Cancelada').length}
            </div>
            <p className="text-sm text-muted-foreground">Canceladas</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo */}
      {visualizacao === 'tabela' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aviso</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Sessão</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licitacoesFiltradas.map((licitacao) => (
                  <TableRow key={licitacao.id}>
                    <TableCell className="font-medium">{licitacao.numeroAviso}</TableCell>
                    <TableCell>{licitacao.modalidade}</TableCell>
                    <TableCell>{licitacao.orgaoResponsavel.nome}</TableCell>
                    <TableCell>
                      <div className="relative">
                        <Badge 
                          className={`${getStatusColorSimple(licitacao.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                          onClick={() => setStatusSelectorOpen(statusSelectorOpen === licitacao.id ? null : licitacao.id)}
                        >
                          {licitacao.status}
                        </Badge>
                        {statusSelectorOpen === licitacao.id && (
                          <StatusSelector
                            currentStatus={licitacao.status}
                            onStatusChange={(novoStatus) => handleStatusChange(licitacao.id, novoStatus)}
                            onClose={() => setStatusSelectorOpen(null)}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(licitacao.dataSessao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{licitacao.itens.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog open={anexosDialogOpen === licitacao.id} onOpenChange={(open) => setAnexosDialogOpen(open ? licitacao.id : null)}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Paperclip className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Anexos PDF - Aviso Nº {licitacao.numeroAviso}</DialogTitle>
                            </DialogHeader>
                            <AnexosPDF licitacaoId={licitacao.id} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onGerenciarCotacoes(licitacao.id)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Cotações
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {licitacoesFiltradas.map((licitacao) => (
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
                    <div className="relative">
                      <Badge 
                        className={`${getStatusColorSimple(licitacao.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => setStatusSelectorOpen(statusSelectorOpen === licitacao.id ? null : licitacao.id)}
                      >
                        {licitacao.status}
                      </Badge>
                      {statusSelectorOpen === licitacao.id && (
                        <StatusSelector
                          currentStatus={licitacao.status}
                          onStatusChange={(novoStatus) => handleStatusChange(licitacao.id, novoStatus)}
                          onClose={() => setStatusSelectorOpen(null)}
                        />
                      )}
                    </div>
                    <Dialog open={anexosDialogOpen === licitacao.id} onOpenChange={(open) => setAnexosDialogOpen(open ? licitacao.id : null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Paperclip className="w-4 h-4 mr-2" />
                          Anexos
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Anexos PDF - Aviso Nº {licitacao.numeroAviso}</DialogTitle>
                        </DialogHeader>
                        <AnexosPDF licitacaoId={licitacao.id} />
                      </DialogContent>
                    </Dialog>
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
          ))}
        </div>
      )}

      <Dialog open={!!anexosDialogOpen} onOpenChange={(open) => setAnexosDialogOpen(open ? anexosDialogOpen : null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Anexos PDF - {anexosDialogOpen && licitacoesFiltradas.find(l => l.id === anexosDialogOpen) ? 
                `Aviso Nº ${licitacoesFiltradas.find(l => l.id === anexosDialogOpen)?.numeroAviso}` : 
                'Carregando...'
              }
            </DialogTitle>
          </DialogHeader>
          {anexosDialogOpen && <AnexosPDF licitacaoId={anexosDialogOpen} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisualizarProcessos;
