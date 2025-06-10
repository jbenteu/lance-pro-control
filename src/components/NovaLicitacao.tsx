
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { Licitacao, Item, StatusLicitacao, Modalidade } from '@/types/licitacao';
import { useToast } from '@/hooks/use-toast';

interface NovaLicitacaoProps {
  onVoltar: () => void;
}

const NovaLicitacao: React.FC<NovaLicitacaoProps> = ({ onVoltar }) => {
  const { addLicitacao, orgaos, fornecedores } = useLicitacao();
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

  const [itens, setItens] = useState<Omit<Item, 'id'>[]>([{
    descricao: '',
    quantidade: 1,
    marca: '',
    modelo: '',
    valorReferenciaUnitario: 0,
    valorReferenciaTotal: 0,
    fornecedorId: '',
    valorUnitario: 0,
    valorTotal: 0,
    freteEntrada: 0,
    freteSaida: 0,
    lanceMinimo: 0,
    porcentagemLucro: 0,
    lanceIdeal: 0
  }]);

  const calcularValores = (item: Omit<Item, 'id'>, campo: string, valor: any) => {
    const novoItem = { ...item, [campo]: valor };
    
    // Calcular valor de referência total
    if (campo === 'quantidade' || campo === 'valorReferenciaUnitario') {
      novoItem.valorReferenciaTotal = novoItem.quantidade * novoItem.valorReferenciaUnitario;
    }
    
    // Calcular valor total
    if (campo === 'quantidade' || campo === 'valorUnitario') {
      novoItem.valorTotal = novoItem.quantidade * (novoItem.valorUnitario || 0);
    }
    
    // Calcular lance ideal (valor unitário + 40%)
    if (campo === 'valorUnitario') {
      novoItem.lanceIdeal = (novoItem.valorUnitario || 0) * 1.4;
    }
    
    // Calcular porcentagem de lucro
    if (campo === 'valorUnitario' || campo === 'lanceMinimo') {
      const valorUnit = novoItem.valorUnitario || 0;
      const lanceMin = novoItem.lanceMinimo || 0;
      if (valorUnit > 0 && lanceMin > 0) {
        novoItem.porcentagemLucro = ((lanceMin - valorUnit) / valorUnit) * 100;
      }
    }
    
    return novoItem;
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = calcularValores(novosItens[index], campo, valor);
    setItens(novosItens);
  };

  const adicionarItem = () => {
    setItens([...itens, {
      descricao: '',
      quantidade: 1,
      marca: '',
      modelo: '',
      valorReferenciaUnitario: 0,
      valorReferenciaTotal: 0,
      fornecedorId: '',
      valorUnitario: 0,
      valorTotal: 0,
      freteEntrada: 0,
      freteSaida: 0,
      lanceMinimo: 0,
      porcentagemLucro: 0,
      lanceIdeal: 0
    }]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numeroAviso || !formData.orgaoResponsavelId || !formData.localEntrega) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
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

    const novaLicitacao: Licitacao = {
      id: Date.now().toString(),
      ...formData,
      orgaoResponsavel: orgaoSelecionado,
      itens: itens.map((item, index) => ({
        ...item,
        id: `${Date.now()}-${index}`,
        fornecedor: item.fornecedorId ? fornecedores.find(f => f.id === item.fornecedorId) : undefined
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addLicitacao(novaLicitacao);
    
    toast({
      title: "Sucesso!",
      description: "Licitação cadastrada com sucesso"
    });
    
    onVoltar();
  };

  const getFornecedorTelefone = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor?.telefone || '';
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

        {/* Itens */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Itens da Licitação</CardTitle>
            <Button type="button" onClick={adicionarItem} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {itens.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Item {index + 1}</h4>
                  {itens.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <Label>Descrição*</Label>
                    <Input
                      value={item.descricao}
                      onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                      placeholder="Descrição do item"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade*</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Input
                      value={item.marca}
                      onChange={(e) => atualizarItem(index, 'marca', e.target.value)}
                      placeholder="Marca do produto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Modelo</Label>
                    <Input
                      value={item.modelo}
                      onChange={(e) => atualizarItem(index, 'modelo', e.target.value)}
                      placeholder="Modelo do produto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Referência Unitário</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.valorReferenciaUnitario}
                      onChange={(e) => atualizarItem(index, 'valorReferenciaUnitario', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Referência Total</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.valorReferenciaTotal}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Select 
                      value={item.fornecedorId || ''} 
                      onValueChange={(value) => atualizarItem(index, 'fornecedorId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {fornecedores.map(fornecedor => (
                          <SelectItem key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.empresa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contato Fornecedor</Label>
                    <Input
                      value={getFornecedorTelefone(item.fornecedorId || '')}
                      disabled
                      className="bg-muted"
                      placeholder="Telefone do fornecedor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Unitário</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.valorUnitario}
                      onChange={(e) => atualizarItem(index, 'valorUnitario', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Total</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.valorTotal}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frete de Entrada</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.freteEntrada}
                      onChange={(e) => atualizarItem(index, 'freteEntrada', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frete de Saída</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.freteSaida}
                      onChange={(e) => atualizarItem(index, 'freteSaida', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lance Mínimo</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.lanceMinimo}
                      onChange={(e) => atualizarItem(index, 'lanceMinimo', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>% de Lucro</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.porcentagemLucro?.toFixed(2) || '0.00'}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lance Ideal</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.lanceIdeal}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

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
