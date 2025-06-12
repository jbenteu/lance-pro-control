
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { Fornecedor } from '@/types/licitacao';
import { useToast } from '@/hooks/use-toast';
import RamoAtuacaoSelector from './RamoAtuacaoSelector';

interface GerenciarFornecedoresProps {
  onVoltar: () => void;
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const GerenciarFornecedores: React.FC<GerenciarFornecedoresProps> = ({ onVoltar }) => {
  const { fornecedores, addFornecedor, updateFornecedor, deleteFornecedor } = useLicitacao();
  const { toast } = useToast();
  
  const [dialogAberto, setDialogAberto] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  
  const [formData, setFormData] = useState({
    empresa: '',
    ramoAtuacao: '',
    uf: '',
    nomeContato: '',
    telefone: '',
    whatsapp: false,
    email: '',
    site: '',
    cnpj: ''
  });

  const resetForm = () => {
    setFormData({
      empresa: '',
      ramoAtuacao: '',
      uf: '',
      nomeContato: '',
      telefone: '',
      whatsapp: false,
      email: '',
      site: '',
      cnpj: ''
    });
    setFornecedorEditando(null);
  };

  const abrirDialogoNovo = () => {
    resetForm();
    setDialogAberto(true);
  };

  const abrirDialogoEdicao = (fornecedor: Fornecedor) => {
    setFormData({
      empresa: fornecedor.empresa,
      ramoAtuacao: fornecedor.ramoAtuacao,
      uf: fornecedor.uf,
      nomeContato: fornecedor.nomeContato,
      telefone: fornecedor.telefone,
      whatsapp: fornecedor.whatsapp,
      email: fornecedor.email,
      site: fornecedor.site || '',
      cnpj: fornecedor.cnpj
    });
    setFornecedorEditando(fornecedor);
    setDialogAberto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresa || !formData.nomeContato || !formData.telefone || !formData.email || !formData.cnpj || !formData.uf || !formData.ramoAtuacao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (fornecedorEditando) {
      updateFornecedor(fornecedorEditando.id, formData);
      toast({
        title: "Sucesso!",
        description: "Fornecedor atualizado com sucesso"
      });
    } else {
      const novoFornecedor: Fornecedor = {
        id: Date.now().toString(),
        ...formData
      };
      addFornecedor(novoFornecedor);
      toast({
        title: "Sucesso!",
        description: "Fornecedor cadastrado com sucesso"
      });
    }
    
    setDialogAberto(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      deleteFornecedor(id);
      toast({
        title: "Sucesso!",
        description: "Fornecedor excluído com sucesso"
      });
    }
  };

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
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Fornecedores</h1>
            <p className="text-muted-foreground">Cadastre e gerencie seus fornecedores</p>
          </div>
        </div>
        
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNovo} className="bg-business-600 hover:bg-business-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {fornecedorEditando ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="empresa">Empresa*</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                    placeholder="Nome da empresa"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <RamoAtuacaoSelector
                    value={formData.ramoAtuacao}
                    onChange={(value) => setFormData({...formData, ramoAtuacao: value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF*</Label>
                  <Select value={formData.uf} onValueChange={(value) => setFormData({...formData, uf: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosBrasil.map(estado => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeContato">Nome do Contato*</Label>
                  <Input
                    id="nomeContato"
                    value={formData.nomeContato}
                    onChange={(e) => setFormData({...formData, nomeContato: e.target.value})}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone*</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 98765-4321"
                    required
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="whatsapp"
                      checked={formData.whatsapp}
                      onCheckedChange={(checked) => setFormData({...formData, whatsapp: checked as boolean})}
                    />
                    <Label htmlFor="whatsapp" className="text-sm">Possui WhatsApp</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@empresa.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    type="url"
                    value={formData.site}
                    onChange={(e) => setFormData({...formData, site: e.target.value})}
                    placeholder="https://www.empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ*</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-business-600 hover:bg-business-700">
                  {fornecedorEditando ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Fornecedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fornecedores.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardContent className="text-center py-12">
                <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum fornecedor cadastrado</h3>
                <p className="text-muted-foreground mb-4">Comece cadastrando seu primeiro fornecedor</p>
                <Button onClick={abrirDialogoNovo} className="bg-business-600 hover:bg-business-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Fornecedor
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          fornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{fornecedor.empresa}</CardTitle>
                    <p className="text-sm text-muted-foreground">{fornecedor.ramoAtuacao}</p>
                  </div>
                  <Badge variant="secondary">{fornecedor.uf}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Contato:</p>
                    <p className="text-sm text-muted-foreground">{fornecedor.nomeContato}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{fornecedor.telefone}</span>
                      {fornecedor.whatsapp && (
                        <Badge variant="outline" className="text-xs">WhatsApp</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{fornecedor.email}</span>
                    </div>
                    
                    {fornecedor.site && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{fornecedor.site}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirDialogoEdicao(fornecedor)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(fornecedor.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default GerenciarFornecedores;
