
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface ItemSimplificadoData {
  objeto: string;
  especificacoes: string;
  quantidade: number;
  valorReferenciaUnitario: number;
  valorReferenciaTotal: number;
}

interface ItemSimplificadoProps {
  itens: ItemSimplificadoData[];
  onItensChange: (itens: ItemSimplificadoData[]) => void;
}

const ItemSimplificado: React.FC<ItemSimplificadoProps> = ({ itens, onItensChange }) => {
  const calcularValorTotal = (quantidade: number, valorUnitario: number) => {
    return quantidade * valorUnitario;
  };

  const atualizarItem = (index: number, campo: keyof ItemSimplificadoData, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    
    // Recalcular valor total quando quantidade ou valor unitário mudarem
    if (campo === 'quantidade' || campo === 'valorReferenciaUnitario') {
      novosItens[index].valorReferenciaTotal = calcularValorTotal(
        novosItens[index].quantidade,
        novosItens[index].valorReferenciaUnitario
      );
    }
    
    onItensChange(novosItens);
  };

  const adicionarItem = () => {
    const novoItem: ItemSimplificadoData = {
      objeto: '',
      especificacoes: '',
      quantidade: 1,
      valorReferenciaUnitario: 0,
      valorReferenciaTotal: 0
    };
    onItensChange([...itens, novoItem]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      onItensChange(itens.filter((_, i) => i !== index));
    }
  };

  return (
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

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Objeto*</Label>
                <Input
                  value={item.objeto}
                  onChange={(e) => atualizarItem(index, 'objeto', e.target.value)}
                  placeholder="Ex: Aquisição de computadores"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Especificações*</Label>
                <Textarea
                  value={item.especificacoes}
                  onChange={(e) => atualizarItem(index, 'especificacoes', e.target.value)}
                  placeholder="Descreva as especificações técnicas detalhadas do item"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label>Valor Referência Unitário (R$)*</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.valorReferenciaUnitario}
                    onChange={(e) => atualizarItem(index, 'valorReferenciaUnitario', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor Referência Total (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.valorReferenciaTotal.toFixed(2)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ItemSimplificado;
