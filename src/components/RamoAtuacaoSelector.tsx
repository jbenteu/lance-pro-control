
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RamoAtuacao {
  id: string;
  nome: string;
}

interface RamoAtuacaoSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const RamoAtuacaoSelector: React.FC<RamoAtuacaoSelectorProps> = ({
  value,
  onChange,
  placeholder = "Selecione o ramo de atuação",
  required = false
}) => {
  const [ramosAtuacao, setRamosAtuacao] = useState<RamoAtuacao[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newRamo, setNewRamo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRamosAtuacao();
  }, []);

  const fetchRamosAtuacao = async () => {
    try {
      const { data, error } = await supabase
        .from('ramos_atuacao')
        .select('id, nome')
        .order('nome');

      if (error) throw error;
      setRamosAtuacao(data || []);
    } catch (error) {
      console.error('Erro ao buscar ramos de atuação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os ramos de atuação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewRamo = async () => {
    if (!newRamo.trim()) return;

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('ramos_atuacao')
        .insert([{ nome: newRamo.trim() }])
        .select()
        .single();

      if (error) throw error;

      const novoRamo = data as RamoAtuacao;
      setRamosAtuacao(prev => [...prev, novoRamo].sort((a, b) => a.nome.localeCompare(b.nome)));
      onChange(novoRamo.nome);
      setNewRamo('');
      setShowAddNew(false);
      
      toast({
        title: "Sucesso!",
        description: "Novo ramo de atuação adicionado"
      });
    } catch (error) {
      console.error('Erro ao adicionar ramo de atuação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o ramo de atuação",
        variant: "destructive"
      });
    } finally {
      setAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setNewRamo('');
    setShowAddNew(false);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Ramo de Atuação{required && '*'}</Label>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Ramo de Atuação{required && '*'}</Label>
      
      {showAddNew ? (
        <div className="flex space-x-2">
          <Input
            value={newRamo}
            onChange={(e) => setNewRamo(e.target.value)}
            placeholder="Digite o novo ramo de atuação"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNewRamo();
              } else if (e.key === 'Escape') {
                handleCancelAdd();
              }
            }}
            autoFocus
          />
          <Button
            onClick={handleAddNewRamo}
            disabled={!newRamo.trim() || adding}
            size="sm"
            className="px-3"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleCancelAdd}
            variant="outline"
            size="sm"
            className="px-3"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {ramosAtuacao.map((ramo) => (
                <SelectItem key={ramo.id} value={ramo.nome}>
                  {ramo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowAddNew(true)}
            variant="outline"
            size="sm"
            className="px-3"
            title="Adicionar novo ramo de atuação"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RamoAtuacaoSelector;
