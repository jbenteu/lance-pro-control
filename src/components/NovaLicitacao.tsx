
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { Licitacao, StatusLicitacao, Modalidade } from '@/types/licitacao';
import { useToast } from '@/hooks/use-toast';
import ItemSimplificado from './ItemSimplificado';

interface NovaLicitacaoProps {
  onVoltar: () => void;
}

interface ItemSimplificadoData {
  objeto: string;
  especificacoes: string;
  quantidade: number;
  valorReferenciaUnitario: number;
  valorReferenciaTotal: number;
}

const NovaLicitacao: React.FC<NovaLicitacaoProps> = ({ onVoltar }) => {
  const { addLicitacao, orgaos } = useLicitacao();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    status: 'Proposta não Cadastrada' as StatusLicitacao,
    numeroAviso: '',
    modalidade: 'Pregão' as Modalidade,
    orgaoResponsavelId: '',
    localEntrega: '',
    descricao: '',
    dataFimRecebiemntoPropostas: '',
    dataSessao: ''
  });

  const [itensSimplificados, setItensSimplificados] = useState<ItemSimplificadoData[]>([{
    objeto: '',
    especificacoes: '',
    quantidade: 1,
    valorReferenciaUnitario: 0,
    valorReferenciaTotal: 0
  }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.numeroAviso || !formData.orgaoResponsavelId || !formData.localEntrega) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validar itens
    const itensValidos = itensSimplificados.every(item => 
      item.objeto.trim() !== '' && 
      item.especificacoes.trim() !== '' && 
      item.quantidade > 0 && 
      item.valorReferenciaUnitario > 0
    );

    if (!itensValidos) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios dos itens",
        variant: "destructive"
      });
      return;
    }

    const orgaoSelecionado = orgaos.find(o => o.id === formData.orgaoResponsavelId);
    if (!orgaoSelecionado) {
      toast({
        title: "Erro", 
        description: "Selecione um órgão responsável válido",
        variant: "destructive"
      });
      return;
    }

    // Converter itens simplificados para o formato completo
    const itensCompletos = itensSimplificados.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      objeto: item.objeto,
      especificacoes: item.especificacoes,
      quantidade: item.quantidade,
      valorReferenciaUnitario: item.valorReferenciaUnitario,
      valorReferenciaTotal: item.valorReferenciaTotal,
      cotacoes: []
    }));

    const novaLicitacao: Licitacao = {
      id: Date.now().toString(),
      ...formData,
      orgaoResponsavel: orgaoSelecionado,
      itens: itensCompletos,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addLicitacao(novaLicitacao);
    
    toast({
      title: "Sucesso!",
      description: "Licitação cadastrada com sucesso. Agora você pode adicionar cotações aos itens."
    });
    
    onVoltar();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onVoltar}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nova Licitação</h1>
          <p className="text-muted-foreground">Cadastre uma nova licitação no sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as StatusLicitacao})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="space-y-2">
                <Label htmlFor="numeroAviso">Nº do Aviso de Contratação Direta*</Label>
                <Input
                  id="numeroAviso"
                  value={formData.numeroAviso}
                  onChange={(e) => setFormData({...formData, numeroAviso: e.target.value})}
                  placeholder="Ex: 001/2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade*</Label>
                <Select 
                  value={formData.modalidade} 
                  onValueChange={(value) => setFormData({...formData, modalidade: value as Modalidade})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dispensa de Licitação">Dispensa de Licitação</SelectItem>
                    <SelectItem value="Pregão">Pregão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgaoResponsavel">Órgão Responsável*</Label>
                <Select 
                  value={formData.orgaoResponsavelId} 
                  onValueChange={(value) => setFormData({...formData, orgaoResponsavelId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o órgão" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgaos.map(orgao => (
                      <SelectItem key={orgao.id} value={orgao.id}>
                        {orgao.nome} - UASG: {orgao.uasg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localEntrega">Local de Entrega*</Label>
                <Input
                  id="localEntrega"
                  value={formData.localEntrega}
                  onChange={(e) => setFormData({...formData, localEntrega: e.target.value})}
                  placeholder="Endereço completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim Recebimento de Propostas*</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={formData.dataFimRecebiemntoPropostas}
                  onChange={(e) => setFormData({...formData, dataFimRecebiemntoPropostas: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataSessao">Data da Sessão*</Label>
                <Input
                  id="dataSessao"
                  type="datetime-local"
                  value={formData.dataSessao}
                  onChange={(e) => setFormData({...formData, dataSessao: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Pequeno texto de descrição dos itens"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Itens Simplificados */}
        <ItemSimplificado 
          itens={itensSimplificados}
          onItensChange={setItensSimplificados}
        />

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onVoltar}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-business-600 hover:bg-business-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Licitação
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovaLicitacao;
