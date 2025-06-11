
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Save, Edit } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { Licitacao, Item, Cotacao } from '@/types/licitacao';
import { useToast } from '@/hooks/use-toast';

interface GerenciarCotacoesProps {
  licitacao: Licitacao;
  onVoltar: () => void;
}

const GerenciarCotacoes: React.FC<GerenciarCotacoesProps> = ({ licitacao, onVoltar }) => {
  const { updateLicitacao, fornecedores } = useLicitacao();
  const { toast } = useToast();
  const [itemSelecionado, setItemSelecionado] = useState<string | null>(null);
  const [editandoCotacao, setEditandoCotacao] = useState<string | null>(null);

  const calcularValores = (cotacao: Partial<Cotacao>, item: Item): Cotacao => {
    const novaCotacao = { ...cotacao } as Cotacao;
    
    // Calcular valor total
    if (cotacao.valorUnitario) {
      novaCotacao.valorTotal = item.quantidade * cotacao.valorUnitario;
    }
    
    // Calcular lance ideal (valor unitário + 40%)
    if (cotacao.valorUnitario) {
      novaCotacao.lanceIdeal = cotacao.valorUnitario * 1.4;
    }
    
    // Calcular porcentagem de lucro
    if (cotacao.valorUnitario && cotacao.lanceMinimo) {
      novaCotacao.porcentagemLucro = ((cotacao.lanceMinimo - cotacao.valorUnitario) / cotacao.valorUnitario) * 100;
    }
    
    return novaCotacao;
  };

  const adicionarCotacao = (itemId: string) => {
    const novaCotacao: Cotacao = {
      id: `cotacao-${Date.now()}-${Math.random()}`,
      fornecedorId: '',
      valorUnitario: 0,
      valorTotal: 0,
      freteEntrada: 0,
      freteSaida: 0,
      lanceMinimo: 0,
      porcentagemLucro: 0,
      lanceIdeal: 0,
      marca: '',
      modelo: ''
    };

    const licitacaoAtualizada = {
      ...licitacao,
      itens: licitacao.itens.map(item => 
        item.id === itemId 
          ? { ...item, cotacoes: [...item.cotacoes, novaCotacao] }
          : item
      ),
      updatedAt: new Date().toISOString()
    };

    updateLicitacao(licitacao.id, licitacaoAtualizada);
    setEditandoCotacao(novaCotacao.id);
  };

  const atualizarCotacao = (itemId: string, cotacaoId: string, campo: string, valor: any) => {
    const licitacaoAtualizada = {
      ...licitacao,
      itens: licitacao.itens.map(item => {
        if (item.id === itemId) {
          const cotacoesAtualizadas = item.cotacoes.map(cotacao => {
            if (cotacao.id === cotacaoId) {
              const cotacaoAtualizada = { ...cotacao, [campo]: valor };
              return calcularValores(cotacaoAtualizada, item);
            }
            return cotacao;
          });
          return { ...item, cotacoes: cotacoesAtualizadas };
        }
        return item;
      }),
      updatedAt: new Date().toISOString()
    };

    updateLicitacao(licitacao.id, licitacaoAtualizada);
  };

  const removerCotacao = (itemId: string, cotacaoId: string) => {
    const licitacaoAtualizada = {
      ...licitacao,
      itens: licitacao.itens.map(item => 
        item.id === itemId 
          ? { ...item, cotacoes: item.cotacoes.filter(c => c.id !== cotacaoId) }
          : item
      ),
      updatedAt: new Date().toISOString()
    };

    updateLicitacao(licitacao.id, licitacaoAtualizada);
    
    if (editandoCotacao === cotacaoId) {
      setEditandoCotacao(null);
    }
  };

  const getFornecedorNome = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor?.empresa || 'Fornecedor não encontrado';
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
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Cotações</h1>
          <p className="text-muted-foreground">
            Licitação {licitacao.numeroAviso} - {licitacao.orgaoResponsavel.nome}
          </p>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar com lista de itens */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Itens da Licitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {licitacao.itens.map((item, index) => (
                <Button
                  key={item.id}
                  variant={itemSelecionado === item.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setItemSelecionado(item.id)}
                >
                  <div>
                    <div className="font-semibold">Item {index + 1}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {item.objeto}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.cotacoes.length} cotação(ões)
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Área principal com detalhes do item */}
        <div className="lg:col-span-2">
          {itemSelecionado ? (
            (() => {
              const item = licitacao.itens.find(i => i.id === itemSelecionado);
              if (!item) return null;

              return (
                <div className="space-y-6">
                  {/* Informações do Item */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes do Item</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Objeto</Label>
                        <p className="text-sm text-muted-foreground">{item.objeto}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Especificações</Label>
                        <p className="text-sm text-muted-foreground">{item.especificacoes}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <Label className="text-sm font-medium">Quantidade</Label>
                          <p className="text-muted-foreground">{item.quantidade}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Valor Unit. Ref.</Label>
                          <p className="text-muted-foreground">R$ {item.valorReferenciaUnitario.toFixed(2)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Valor Total Ref.</Label>
                          <p className="text-muted-foreground">R$ {item.valorReferenciaTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cotações */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Cotações</CardTitle>
                      <Button onClick={() => adicionarCotacao(item.id)} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Cotação
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {item.cotacoes.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Nenhuma cotação adicionada ainda
                        </p>
                      ) : (
                        item.cotacoes.map((cotacao, index) => (
                          <Card key={cotacao.id} className="border-l-4 border-l-business-500">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">Cotação {index + 1}</CardTitle>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditandoCotacao(
                                      editandoCotacao === cotacao.id ? null : cotacao.id
                                    )}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removerCotacao(item.id, cotacao.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {editandoCotacao === cotacao.id ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Fornecedor*</Label>
                                    <Select 
                                      value={cotacao.fornecedorId} 
                                      onValueChange={(value) => atualizarCotacao(item.id, cotacao.id, 'fornecedorId', value)}
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
                                    <Label>Telefone</Label>
                                    <Input
                                      value={getFornecedorTelefone(cotacao.fornecedorId)}
                                      disabled
                                      className="bg-muted"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Marca</Label>
                                    <Input
                                      value={cotacao.marca || ''}
                                      onChange={(e) => atualizarCotacao(item.id, cotacao.id, 'marca', e.target.value)}
                                      placeholder="Marca do produto"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Modelo</Label>
                                    <Input
                                      value={cotacao.modelo || ''}
                                      onChange={(e) => atualizarCotacao(item.id, cotacao.id, 'modelo', e.target.value)}
                                      placeholder="Modelo do produto"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Valor Unitário (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={cotacao.valorUnitario}
                                      onChange={(e) => atualizarCotacao(item.id, cotacao.id, 'valorUnitario', parseFloat(e.target.value) || 0)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Valor Total (R$)</Label>
                                    <Input
                                      value={(cotacao.valorTotal || 0).toFixed(2)}
                                      disabled
                                      className="bg-muted"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Frete Entrada (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={cotacao.freteEntrada || 0}
                                      onChange={(e) => atualizarCotacao(item.id, cotacao.id, 'freteEntrada', parseFloat(e.target.value) || 0)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Frete Saída (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={cotacao.freteSaida || 0}
                                      onChange={(e) => atualizarCotacao(item.id, cotacao.id, 'freteSaida', parseFloat(e.target.value) || 0)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Lance Mínimo (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={cotacao.lanceMinimo || 0}
                                      onChange={(e) => atualizarCotacao(item.id, cotacao.id, 'lanceMinimo', parseFloat(e.target.value) || 0)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>% Lucro</Label>
                                    <Input
                                      value={(cotacao.porcentagemLucro || 0).toFixed(2) + '%'}
                                      disabled
                                      className="bg-muted"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Lance Ideal (R$)</Label>
                                    <Input
                                      value={(cotacao.lanceIdeal || 0).toFixed(2)}
                                      disabled
                                      className="bg-muted"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <Label className="text-sm font-medium">Fornecedor</Label>
                                    <p className="text-muted-foreground">
                                      {cotacao.fornecedorId ? getFornecedorNome(cotacao.fornecedorId) : 'Não selecionado'}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Valor Unit.</Label>
                                    <p className="text-muted-foreground">R$ {(cotacao.valorUnitario || 0).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Valor Total</Label>
                                    <p className="text-muted-foreground">R$ {(cotacao.valorTotal || 0).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Lance Mín.</Label>
                                    <p className="text-muted-foreground">R$ {(cotacao.lanceMinimo || 0).toFixed(2)}</p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Selecione um item para gerenciar suas cotações
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerenciarCotacoes;
