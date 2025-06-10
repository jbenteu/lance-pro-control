
export interface Fornecedor {
  id: string;
  empresa: string;
  ramoAtuacao: string;
  uf: string;
  nomeContato: string;
  telefone: string;
  whatsapp: boolean;
  email: string;
  site?: string;
  cnpj: string;
}

export interface Orgao {
  id: string;
  nome: string;
  uasg: string;
}

export interface Item {
  id: string;
  descricao: string;
  quantidade: number;
  marca: string;
  modelo: string;
  valorReferenciaUnitario: number;
  valorReferenciaTotal: number;
  fornecedorId?: string;
  fornecedor?: Fornecedor;
  valorUnitario?: number;
  valorTotal?: number;
  freteEntrada?: number;
  freteSaida?: number;
  lanceMinimo?: number;
  porcentagemLucro?: number;
  lanceIdeal?: number;
}

export type StatusLicitacao = 
  | 'Proposta não Cadastrada'
  | 'Proposta Cadastrada'
  | 'Em Disputa'
  | 'Seleção de Fornecedores'
  | 'Aceita'
  | 'Aceita e Habilitada'
  | 'Aguardando Nota de Empenho'
  | 'Aguardando Entrega'
  | 'Entregue'
  | 'Cancelada';

export type Modalidade = 'Dispensa de Licitação' | 'Pregão';

export interface Licitacao {
  id: string;
  status: StatusLicitacao;
  numeroAviso: string;
  modalidade: Modalidade;
  orgaoResponsavel: Orgao;
  localEntrega: string;
  descricao: string;
  dataFimRecebiemntoPropostas: string;
  dataSessao: string;
  itens: Item[];
  createdAt: string;
  updatedAt: string;
}
