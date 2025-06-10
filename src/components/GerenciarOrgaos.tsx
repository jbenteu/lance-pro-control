
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Building, ArrowLeft } from 'lucide-react';
import { useLicitacao } from '@/contexts/LicitacaoContext';
import { Orgao } from '@/types/licitacao';
import { useToast } from '@/hooks/use-toast';

interface GerenciarOrgaosProps {
  onVoltar: () => void;
}

const GerenciarOrgaos: React.FC<GerenciarOrgaosProps> = ({ onVoltar }) => {
  const { orgaos, addOrgao, updateOrgao, deleteOrgao } = useLicitacao();
  const { toast } = useToast();
  
  const [dialogAberto, setDialogAberto] = useState(false);
  const [orgaoEditando, setOrgaoEditando] = useState<Orgao | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    uasg: ''
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      uasg: ''
    });
    setOrgaoEditando(null);
  };

  const abrirDialogoNovo = () => {
    resetForm();
    setDialogAberto(true);
  };

  const abrirDialogoEdicao = (orgao: Orgao) => {
    setFormData({
      nome: orgao.nome,
      uasg: orgao.uasg
    });
    setOrgaoEditando(orgao);
    setDialogAberto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.uasg) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (orgaoEditando) {
      updateOrgao(orgaoEditando.id, formData);
      toast({
        title: "Sucesso!",
        description: "Órgão atualizado com sucesso"
      });
    } else {
      const novoOrgao: Orgao = {
        id: Date.now().toString(),
        ...formData
      };
      addOrgao(novoOrgao);
      toast({
        title: "Sucesso!",
        description: "Órgão cadastrado com sucesso"
      });
    }
    
    setDialogAberto(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este órgão?')) {
      deleteOrgao(id);
      toast({
        title: "Sucesso!",
        description: "Órgão excluído com sucesso"
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
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Órgãos</h1>
            <p className="text-muted-foreground">Cadastre e gerencie os órgãos responsáveis</p>
          </div>
        </div>
        
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNovo} className="bg-business-600 hover:bg-business-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Órgão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {orgaoEditando ? 'Editar Órgão' : 'Novo Órgão'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Órgão*</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Prefeitura Municipal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uasg">UASG*</Label>
                <Input
                  id="uasg"
                  value={formData.uasg}
                  onChange={(e) => setFormData({...formData, uasg: e.target.value})}
                  placeholder="Ex: 123456"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-business-600 hover:bg-business-700">
                  {orgaoEditando ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Órgãos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgaos.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardContent className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum órgão cadastrado</h3>
                <p className="text-muted-foreground mb-4">Comece cadastrando seu primeiro órgão</p>
                <Button onClick={abrirDialogoNovo} className="bg-business-600 hover:bg-business-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Órgão
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          orgaos.map((orgao) => (
            <Card key={orgao.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  {orgao.nome}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">UASG:</p>
                    <p className="text-lg font-mono">{orgao.uasg}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirDialogoEdicao(orgao)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(orgao.id)}
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

export default GerenciarOrgaos;
