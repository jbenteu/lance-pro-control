
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Download, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Anexo {
  id: string;
  nome_arquivo: string;
  caminho_arquivo: string;
  tamanho_arquivo: number;
  created_at: string;
}

interface AnexosPDFProps {
  licitacaoId: string;
}

const AnexosPDF: React.FC<AnexosPDFProps> = ({ licitacaoId }) => {
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAnexos();
  }, [licitacaoId]);

  const carregarAnexos = async () => {
    try {
      const { data, error } = await supabase
        .from('licitacao_anexos')
        .select('*')
        .eq('licitacao_id', licitacaoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnexos(data || []);
    } catch (error) {
      console.error('Erro ao carregar anexos:', error);
      toast.error('Erro ao carregar anexos');
    } finally {
      setLoading(false);
    }
  };

  const uploadArquivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Arquivo muito grande. Máximo 10MB');
      return;
    }

    setUploading(true);

    try {
      const fileName = `${licitacaoId}/${Date.now()}-${file.name}`;
      
      // Upload para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('licitacao-anexos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Salvar referência no banco
      const { error: dbError } = await supabase
        .from('licitacao_anexos')
        .insert({
          licitacao_id: licitacaoId,
          nome_arquivo: file.name,
          caminho_arquivo: uploadData.path,
          tamanho_arquivo: file.size
        });

      if (dbError) throw dbError;

      toast.success('Arquivo enviado com sucesso!');
      carregarAnexos();
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const deletarAnexo = async (anexo: Anexo) => {
    try {
      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('licitacao-anexos')
        .remove([anexo.caminho_arquivo]);

      if (storageError) throw storageError;

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('licitacao_anexos')
        .delete()
        .eq('id', anexo.id);

      if (dbError) throw dbError;

      toast.success('Arquivo deletado com sucesso!');
      carregarAnexos();
    } catch (error) {
      console.error('Erro ao deletar anexo:', error);
      toast.error('Erro ao deletar arquivo');
    }
  };

  const downloadAnexo = async (anexo: Anexo) => {
    try {
      const { data, error } = await supabase.storage
        .from('licitacao-anexos')
        .download(anexo.caminho_arquivo);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = anexo.nome_arquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const visualizarAnexo = async (anexo: Anexo) => {
    try {
      const { data } = await supabase.storage
        .from('licitacao-anexos')
        .getPublicUrl(anexo.caminho_arquivo);

      window.open(data.publicUrl, '_blank');
    } catch (error) {
      console.error('Erro ao visualizar arquivo:', error);
      toast.error('Erro ao visualizar arquivo');
    }
  };

  const formatarTamanho = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando anexos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Anexos PDF</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Adicionar arquivo PDF
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  Máximo 10MB
                </span>
              </label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={uploadArquivo}
                disabled={uploading}
                className="hidden"
              />
            </div>
            {uploading && (
              <div className="mt-2">
                <div className="text-sm text-blue-600">Enviando arquivo...</div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de anexos */}
        {anexos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum anexo PDF encontrado
          </div>
        ) : (
          <div className="space-y-2">
            {anexos.map((anexo) => (
              <div
                key={anexo.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium text-sm">{anexo.nome_arquivo}</div>
                    <div className="text-xs text-gray-500">
                      {formatarTamanho(anexo.tamanho_arquivo)} • {new Date(anexo.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => visualizarAnexo(anexo)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadAnexo(anexo)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletarAnexo(anexo)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnexosPDF;
