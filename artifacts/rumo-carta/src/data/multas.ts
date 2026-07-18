/**
 * Tabela de transgressões e multas do Código da Estrada de Moçambique.
 * Fonte: "Código da Estrada — Transgressões & Multas", Elísio de Sousa (2019),
 * disponibilizado em attached_assets/. Conteúdo de referência, não substitui
 * consulta ao Código da Estrada oficial nem aconselhamento jurídico.
 */

export interface Multa {
  infracao: string;
  artigo: string;
  multa: string;
  responsavel: string;
}

export interface GrupoMultas {
  id: string;
  titulo: string;
  itens: Multa[];
}

export const GRUPOS_MULTAS: GrupoMultas[] = [
  {
    id: "obstaculos",
    titulo: "Obstáculos na Via Pública",
    itens: [
      { infracao: "Impedir ou embaraçar a circulação de veículos", artigo: "Art.º 3, n.º 3", multa: "3.000,00 MT", responsavel: "Condutor" },
      { infracao: "Colocação de obstáculos para impedir ou embaraçar o trânsito", artigo: "Art.º 4, n.º 2", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Eventos (festas, provas, cortejos) na estrada sem autorização", artigo: "Art.º 5, n.º 4", multa: "5.000,00 MT", responsavel: "Condutor" },
      { infracao: "Circulação de veículos não autorizados", artigo: "Art.º 7, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "desobediencia-agente",
    titulo: "Desobediência ao Agente da Polícia de Trânsito",
    itens: [
      { infracao: "Não obedecer ao sinal de paragem do agente da PT", artigo: "Art.º 11, n.º 3", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Obedecer tardiamente ao sinal de paragem do agente da PT", artigo: "Art.º 11, n.º 3", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Falta de sinalização de obstáculos eventuais", artigo: "Art.º 12, n.º 3", multa: "10.000,00 MT + inibição de conduzir (1 a 2 anos)", responsavel: "Condutor ou empresa responsável" },
      { infracao: "Interrupção ou condicionamento de vias de circulação", artigo: "Art.º 12, n.º 6", multa: "5.000,00 MT", responsavel: "Empresa ou particular responsável" },
      { infracao: "Desobediência aos sinais de regulação do agente da PT", artigo: "Art.º 14, n.º 3", multa: "1.000,00 MT + inibição de conduzir (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Desobediência aos veículos prioritários (ambulâncias e comitivas governamentais)", artigo: "Art.º 15, n.º 4", multa: "1.000,00 MT + inibição de conduzir (1 a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "conducao-segura",
    titulo: "Condução Segura (Ultrapassagem, Distâncias)",
    itens: [
      { infracao: "Condução com parte do corpo fora do veículo", artigo: "Art.º 16, n.º 3 e 4", multa: "1.000,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Condução que prejudique a segurança na estrada", artigo: "Art.º 16, n.º 2 e 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução à direita ou não encostada à berma esquerda", artigo: "Art.º 17, n.º 3", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução na fila de trânsito à direita", artigo: "Art.º 18, n.º 3", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Mudança de fila sem a tomada de precauções", artigo: "Art.º 18, n.º 2 e 3", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Início da marcha sem sinalização", artigo: "Art.º 19, n.º 2", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Falta de manutenção de distância segura entre veículos", artigo: "Art.º 20, n.º 3", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Travessia de veículos em passeios à margem do regulamento local", artigo: "Art.º 21, n.º 2", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Ultrapassagem nos cruzamentos e entroncamentos", artigo: "Art.º 22, n.º 4 e 5", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução à direita de entroncamentos e cruzamentos", artigo: "Art.º 22, n.º 1 e 5", multa: "1.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "sinais-luminosos-sonoros",
    titulo: "Sinais Luminosos e Sonoros",
    itens: [
      { infracao: "Não uso do sinal luminoso (pisca) nas manobras", artigo: "Art.º 23, n.º 3", multa: "500,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Mau uso dos sinais sonoros (buzina) ou uso para protestos", artigo: "Art.º 24, n.º 8", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Uso de sinais sonoros especiais", artigo: "Art.º 25, n.º 3", multa: "1.000,00 MT + remoção/apreensão do livrete", responsavel: "Condutor" },
      { infracao: "Uso irregular dos sinais luminosos em substituição aos sonoros", artigo: "Art.º 26, n.º 2", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Uso de sinais luminosos especiais", artigo: "Art.º 27, n.º 5 e 7", multa: "2.000,00 MT + remoção/apreensão do livrete", responsavel: "Condutor" },
      { infracao: "Uso de máximos (luzes) em locais bem iluminados", artigo: "Art.º 27, n.º 6 e art.º 28", multa: "1.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "velocidades",
    titulo: "Velocidades",
    itens: [
      { infracao: "Excesso de velocidade simples (incapacidade para travar atempadamente)", artigo: "Art.º 30, n.º 2", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Trânsito em marcha lenta que embaraça o trânsito", artigo: "Art.º 31, n.º 2", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Excesso de velocidade em locais especialmente protegidos", artigo: "Art.º 30, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Velocidade máxima dentro das localidades: 20 km/h acima (leve)", artigo: "Art.º 33, n.º 1", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Velocidade máxima dentro das localidades: 40 km/h acima (leve, com inibição)", artigo: "Art.º 33, n.º 1", multa: "2.000,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Velocidade máxima dentro das localidades: 60 km/h acima (grave, com inibição)", artigo: "Art.º 33, n.º 1", multa: "4.000,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Velocidade máxima dentro das localidades: mais de 60 km/h acima (grave)", artigo: "Art.º 33, n.º 1", multa: "8.000,00 MT", responsavel: "Condutor" },
      { infracao: "Velocidade máxima fora das localidades: 20 km/h acima (leve)", artigo: "Art.º 33, n.º 2", multa: "1.000,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Velocidade máxima fora das localidades: 40 km/h acima (leve, com inibição)", artigo: "Art.º 33, n.º 2", multa: "2.000,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Velocidade máxima fora das localidades: 60 km/h acima (grave)", artigo: "Art.º 33, n.º 2", multa: "4.000,00 MT", responsavel: "Condutor" },
      { infracao: "Velocidade máxima fora das localidades: mais de 60 km/h acima (grave)", artigo: "Art.º 33, n.º 2", multa: "8.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução em velocidade inferior a 40 km/h na auto-estrada", artigo: "Art.º 33, n.º 3 e Art.º 31, n.º 2", multa: "500,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Condução acima de 90 km/h por não profissionais com menos de 1 ano de carta", artigo: "Art.º 33, n.º 4 e Art.º 31, n.º 2", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Inobservância dos limites especiais de velocidade em transportes ou zonas específicas", artigo: "Art.º 37 (regras gerais do art.º 33)", multa: "Conforme regras gerais do art.º 33", responsavel: "Condutor" },
    ],
  },
  {
    id: "prioridade-passagem",
    titulo: "Regras de Prioridade de Passagem",
    itens: [
      { infracao: "Desobediência às regras de prioridade de passagem", artigo: "Art.º 38, n.º 6", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Desobediência às regras de cedência de passagem", artigo: "Art.º 39, n.º 4", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Desobediência à cedência de passagem a colunas militares/militarizadas", artigo: "Art.º 40, n.º 1 e 5", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Desobediência à cedência de passagem a velocípedes e tracção animal", artigo: "Art.º 40, n.º 2 e 6", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Desobediência às regras sobre o cruzamento dos veículos", artigo: "Art.º 41, n.º 7", multa: "1.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "ultrapassagem-direccao",
    titulo: "Ultrapassagens e Mudança de Direcção",
    itens: [
      { infracao: "Ultrapassagem irregular", artigo: "Art.º 43, n.º 9", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Ultrapassagem proibida em determinados locais", artigo: "Art.º 44, n.º 5", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Mudança de direcção irregular", artigo: "Art.º 45, n.º 5", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Mudança de direcção para a esquerda de forma irregular", artigo: "Art.º 46, n.º 2", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Inversão do sentido de marcha irregular", artigo: "Art.º 47, n.º 3", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Marcha atrás irregular", artigo: "Art.º 48, n.º 5", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "estacionamento",
    titulo: "Regras de Estacionamento",
    itens: [
      { infracao: "Estacionamento irregular (simples)", artigo: "Art.º 49, n.º 6", multa: "1.500,00 MT", responsavel: "Condutor" },
      { infracao: "Estacionamento em locais proibidos", artigo: "Art.º 50, n.º 3", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Estacionamento em locais proibidos dentro das localidades", artigo: "Art.º 51, n.º 1 e 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Estacionamento em locais proibidos fora das localidades", artigo: "Art.º 51, n.º 2 e 5", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Paragem irregular de veículo de transporte colectivo de passageiros", artigo: "Art.º 53, n.º 3", multa: "1.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "descarga-lotacao-peso",
    titulo: "Descarregamento, Lotação e Peso",
    itens: [
      { infracao: "Descarregamento de pessoas e carga de forma irregular (lentidão)", artigo: "Art.º 54, n.º 3", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Lotação excessiva de passageiros, passageiros fora dos assentos", artigo: "Art.º 55, n.º 6", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Transporte e descarregamento irregular de carga", artigo: "Art.º 56, n.º 5", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Excesso de peso ou de dimensões do veículo (sem autorização)", artigo: "Art.º 57 e 58, n.º 7", multa: "10.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "iluminacao",
    titulo: "Iluminação, Faróis e Luzes",
    itens: [
      { infracao: "Ausência de todos os faróis de iluminação e sinalização", artigo: "Art.º 59, n.º 3", multa: "2.000,00 MT", responsavel: "Condutor" },
      { infracao: "Ausência de algum dos faróis de iluminação e sinalização", artigo: "Art.º 59, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Uso de luzes não previstas no Código e no Regulamento", artigo: "Art.º 60, n.º 3", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Uso irregular dos mínimos e médios", artigo: "Art.º 61, n.º 4", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Uso de máximos em cruzamentos ou a menos de 100 m do veículo antecedente", artigo: "Art.º 61, n.º 5", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Circulação de veículo com avaria nas luzes", artigo: "Art.º 62, n.º 4", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Não uso de luzes de emergência em casos de perigo, obstáculo, intempéries", artigo: "Art.º 63, n.º 5", multa: "750,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "outras-infraccoes",
    titulo: "Outras Infracções",
    itens: [
      { infracao: "Falta de cobertura com lonas ou oleados no transporte de cargas especiais", artigo: "Art.º 64, n.º 3", multa: "2.000,00 MT", responsavel: "Condutor" },
      { infracao: "Desobediência referente ao trânsito de veículos em serviço de urgência", artigo: "Art.º 65, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Não ceder passagem à direita a veículos em serviço de urgência", artigo: "Art.º 66, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Não ceder prioridade a veículos ferroviários na passagem de nível", artigo: "Art.º 67, n.º 5", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Não remoção de veículo/carga quedada em passagem de nível", artigo: "Art.º 68, n.º 2", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Desobediência às regras de travessias em cruzamentos e entroncamentos", artigo: "Art.º 69, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Atravessar linha destinada a demarcação de estacionamento", artigo: "Art.º 70, n.º 1 e 3", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Estacionamento proibido para venda de artigos ou excesso de tempo", artigo: "Art.º 71, n.º 2", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Trânsito de velocípedes de tracção animal na auto-estrada / sem luzes regulamentares", artigo: "Art.º 72, n.º 1, 2 e 3", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Trânsito de peões nas auto-estradas", artigo: "Art.º 72, n.º 1 e 3", multa: "100,00 MT", responsavel: "Peão" },
      { infracao: "Marcha atrás, inversão, ensino de condução ou transposição de separadores na auto-estrada", artigo: "Art.º 72, n.º 2 e 4", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "entrada-saida-estrada",
    titulo: "Entrada e Saída de Veículos na Estrada",
    itens: [
      { infracao: "Desobediência às regras de entrada e saída das auto-estradas", artigo: "Art.º 73, n.º 4", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Não uso das 2 faixas à esquerda por conjuntos de veículos pesados", artigo: "Art.º 74, n.º 2", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Trânsito nas faixas reservadas a transporte público", artigo: "Art.º 75, n.º 2", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Uso de corredores de circulação por veículos não autorizados", artigo: "Art.º 76, n.º 1 e 3", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Uso de veículos a motor em pistas destinadas a animais ou velocípedes", artigo: "Art.º 77, n.º 1, 2, 3 e 5", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Uso pelos peões das pistas de velocípedes e animais", artigo: "Art.º 77, n.º 4 e 6", multa: "300,00 MT", responsavel: "Peão" },
    ],
  },
  {
    id: "poluicao",
    titulo: "Poluição Sonora e Ambiental",
    itens: [
      { infracao: "Excesso de fumo e derramamento de óleo do veículo", artigo: "Art.º 78, n.º 2", multa: "750,00 MT", responsavel: "Proprietário" },
      { infracao: "Atirar objectos para fora do veículo (condutor ou passageiro)", artigo: "Art.º 78, n.º 4", multa: "500,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor/Passageiro" },
      { infracao: "Poluição sonora: excesso de 0 a 5 decibéis", artigo: "Art.º 79, n.º 5, al. a)", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Poluição sonora: excesso de 6 a 10 decibéis", artigo: "Art.º 79, n.º 5, al. b)", multa: "1.500,00 MT", responsavel: "Condutor" },
      { infracao: "Poluição sonora: excesso de 11 a 20 decibéis", artigo: "Art.º 79, n.º 5, al. c)", multa: "3.000,00 MT", responsavel: "Condutor" },
      { infracao: "Poluição sonora: excesso acima de 20 decibéis", artigo: "Art.º 79, n.º 5, al. d)", multa: "Apreensão do veículo + prisão até 3 meses", responsavel: "Condutor" },
    ],
  },
  {
    id: "alcool-substancias",
    titulo: "Condução sob Efeito do Álcool e/ou Substâncias Proibidas",
    itens: [
      { infracao: "Recusa de submissão ao teste de álcool e substâncias proibidas", artigo: "Art.º 80, n.º 2", multa: "Crime de desobediência (prisão até 3 meses) + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Recusa ou negligência do médico na avaliação de níveis de consumo", artigo: "Art.º 80, n.º 3", multa: "Crime de desobediência (prisão até 3 meses)", responsavel: "Médico" },
      { infracao: "Transporte de bebidas alcoólicas ou substâncias proibidas nos assentos de passageiros", artigo: "Art.º 81, n.º 1 e 6", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Taxa de álcool 0.0–0.29 mg/l (serviços públicos)", artigo: "Art.º 81, n.º 2 e 7", multa: "1.500,00 MT (veículos particulares: sem punição)", responsavel: "Condutor" },
      { infracao: "Taxa de álcool 0.3–0.40 mg/l", artigo: "Art.º 81, n.º 2 e 7", multa: "2.500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Taxa de álcool 0.41–0.70 mg/l", artigo: "Art.º 81, n.º 2 e 7", multa: "3.500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Taxa de álcool superior a 0.71 mg/l", artigo: "Art.º 81, n.º 2 e 7", multa: "5.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Taxa de álcool superior a 1.2 mg/l (não profissionais)", artigo: "Art.º 81, n.º 8", multa: "Prisão até 1 mês + 5.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Taxa de álcool superior a 1.2 mg/l (profissionais)", artigo: "Art.º 81, n.º 8", multa: "Prisão até 6 meses + 5.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Condução sob efeito de estupefacientes ou substâncias psicotrópicas", artigo: "Art.º 81, n.º 10", multa: "2.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "cinto-capacete",
    titulo: "Cinto de Segurança e Capacetes",
    itens: [
      { infracao: "Transporte irregular de crianças menores de 3 anos (por criança)", artigo: "Art.º 87, n.º 4 a 8", multa: "300,00 MT/criança + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Não uso do cinto de segurança", artigo: "Art.º 87, n.º 1 e 9", multa: "500,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
      { infracao: "Não uso do capacete", artigo: "Art.º 87, n.º 2 e 10", multa: "300,00 MT + inibição (3 meses a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "telemovel-dispositivos",
    titulo: "Telemóveis e Outros Dispositivos Proibidos",
    itens: [
      { infracao: "Obrigação de carta profissional para condução remunerada", artigo: "Art.º 88, n.º 3", multa: "10.000,00 MT", responsavel: "Condutor e entidade patronal" },
      { infracao: "Uso de telemóveis, rádios ou televisores sem auscultadores/alta-voz em marcha", artigo: "Art.º 89, n.º 1 e 4", multa: "2.000,00 MT", responsavel: "Condutor" },
      { infracao: "Dispositivo para perturbar mecanismos de fiscalização rodoviária", artigo: "Art.º 89, n.º 3 e 5", multa: "2.750,00 MT + remoção/apreensão do livrete", responsavel: "Condutor" },
      { infracao: "Não remoção de veículo da faixa de circulação em avaria sanável", artigo: "Art.º 90, n.º 5", multa: "1.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "coletes-triangulos",
    titulo: "Coletes, Reflectores e Triângulos",
    itens: [
      { infracao: "Uso obrigatório de coletes reflectores e/ou 2 triângulos de pré-sinalização", artigo: "Art.º 91, n.º 8", multa: "1.000,00 MT", responsavel: "Proprietário" },
      { infracao: "Uso de triângulos e coletes irregulares", artigo: "Art.º 91, n.º 8", multa: "300,00 MT", responsavel: "Proprietário" },
      { infracao: "Uso inadequado de coletes/triângulos de pré-sinalização", artigo: "Art.º 91, n.º 8", multa: "500,00 MT", responsavel: "Proprietário" },
      { infracao: "Não exibição de documentos do veículo/condutor após acidente", artigo: "Art.º 92, n.º 1 e 3", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Não permanência no local de acidente com mortos e/ou feridos", artigo: "Art.º 92, n.º 2 e 4", multa: "750,00 MT (se não aplicável sanção mais grave)", responsavel: "Condutor" },
    ],
  },
  {
    id: "motociclos",
    titulo: "Motociclos, Ciclomotores e Velocípedes",
    itens: [
      { infracao: "Condução sem mãos/pedais, rebocado, em par, ou levantamento de rodas", artigo: "Art.º 93, n.º 1 e 3", multa: "300,00 MT", responsavel: "Condutor" },
      { infracao: "Transporte de passageiro com menos de 7 anos em motociclo/ciclomotor/velocípede", artigo: "Art.º 94, n.º 2", multa: "300,00 MT", responsavel: "Condutor" },
      { infracao: "Transporte de cargas em atrelado/caixa por motociclo, ciclomotor ou velocípede", artigo: "Art.º 95, n.º 3", multa: "250,00 MT", responsavel: "Condutor" },
      { infracao: "Não manter luzes acesas em motociclos, triciclos, quadriciclos, ciclomotores", artigo: "Art.º 96, n.º 4", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Procedimento incorrecto em caso de avaria das luzes", artigo: "Art.º 97, n.º 3", multa: "250,00 MT", responsavel: "Condutor" },
      { infracao: "Redução para metade das multas aplicáveis a velocípedes", artigo: "Art.º 99", multa: "50% do valor das multas acima", responsavel: "Ciclista" },
    ],
  },
  {
    id: "traccao-animal",
    titulo: "Disposições Especiais para Veículos de Tracção Animal",
    itens: [
      { infracao: "Violação das regras de condução e orientação de veículos de tracção animal", artigo: "Art.º 100, n.º 6", multa: "300,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "peoes",
    titulo: "Disposições Especiais para Peões",
    itens: [
      { infracao: "Trânsito fora dos passeios, pistas ou bermas", artigo: "Art.º 102, n.º 5", multa: "250,00 MT", responsavel: "Peão" },
      { infracao: "Trânsito pela faixa de rodagem sem motivo permitido", artigo: "Art.º 102, n.º 5", multa: "250,00 MT + inibição (3 meses a 2 anos, se aplicável)", responsavel: "Peão" },
      { infracao: "Trânsito pelo lado esquerdo da berma fora dos casos admitidos", artigo: "Art.º 103, n.º 4", multa: "250,00 MT", responsavel: "Peão" },
      { infracao: "Atravessamento irregular ou paragem na faixa de rodagem", artigo: "Art.º 104, n.º 5", multa: "250,00 MT", responsavel: "Peão" },
      { infracao: "Falta de sinais luminosos em cortejos durante a noite", artigo: "Art.º 105, n.º 2", multa: "500,00 MT", responsavel: "Peão" },
      { infracao: "Não ceder prioridade a peões deficientes já a atravessar", artigo: "Art.º 106, n.º 5", multa: "1.000,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "reboques",
    titulo: "Reboques",
    itens: [
      { infracao: "Uso de 2 ou mais semi-reboques fora do regime interlink", artigo: "Art.º 113, n.º 6 e 9", multa: "10.000,00 MT", responsavel: "Condutor" },
    ],
  },
  {
    id: "caracteristicas-veiculos",
    titulo: "Características dos Veículos",
    itens: [
      { infracao: "Violação das normas de fabrico e comercialização de veículos (pessoa colectiva)", artigo: "Art.º 117, n.º 4", multa: "10.000,00 MT", responsavel: "Fabricante/Comerciante" },
      { infracao: "Violação das normas de fabrico e comercialização de veículos (individual)", artigo: "Art.º 117, n.º 4", multa: "5.000,00 MT", responsavel: "Fabricante/Comerciante" },
      { infracao: "Uso de modelos de veículos não aprovados", artigo: "Art.º 117, n.º 5", multa: "500,00 MT", responsavel: "Proprietário" },
      { infracao: "Importação de veículos com volante à esquerda para fins comerciais", artigo: "Art.º 117, n.º 6", multa: "Nada previsto", responsavel: "Importador" },
      { infracao: "Trânsito de modelos de veículos não aprovados", artigo: "Art.º 117, n.º 7", multa: "500,00 MT", responsavel: "Proprietário" },
      { infracao: "Transformação das características construtivas e funcionais do veículo", artigo: "Art.º 118, n.º 3", multa: "1.000,00 MT", responsavel: "Proprietário" },
    ],
  },
  {
    id: "inspeccoes-matriculas",
    titulo: "Inspecções e Matrículas",
    itens: [
      { infracao: "Falta de inspecção obrigatória", artigo: "Art.º 119, n.º 3", multa: "2.000,00 MT", responsavel: "Proprietário" },
      { infracao: "Circulação de veículo automóvel sem matrícula", artigo: "Art.º 120, n.º 7", multa: "5.000,00 MT", responsavel: "Proprietário" },
      { infracao: "Circulação de ciclomotor, tractocarro, tractor ou reboque agrícola/florestal irregular", artigo: "Art.º 120, n.º 7", multa: "2.500,00 MT", responsavel: "Proprietário" },
      { infracao: "Circulação com veículo cujas características não correspondem ao livrete", artigo: "Art.º 122, n.º 10", multa: "750,00 MT + inibição (3 meses a 2 anos, se aplicável)", responsavel: "Proprietário" },
      { infracao: "Não cancelamento da matrícula após inutilização/desaparecimento (30 dias)", artigo: "Art.º 123, n.º 1 e 9", multa: "500,00 MT (ou sanção mais grave)", responsavel: "Proprietário" },
    ],
  },
  {
    id: "carta-conducao",
    titulo: "Carta de Condução",
    itens: [
      { infracao: "Revalidação, troca, substituição ou duplicado de título fora do prazo", artigo: "Art.º 126, n.º 12", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Validação fora do prazo de cartas de cidadãos da SADC", artigo: "Art.º 126, n.º 12", multa: "500,00 MT", responsavel: "Condutor" },
      { infracao: "Condução com carta de categoria incompatível com o veículo", artigo: "Art.º 127, n.º 8", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução de veículo agrícola/florestal com carta não averbada", artigo: "Art.º 127, n.º 9", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução por pessoa com deformação sem habilitação para tal", artigo: "Art.º 127, n.º 10", multa: "1.500,00 MT", responsavel: "Condutor" },
      { infracao: "Condução sem trazer a carta consigo (esquecimento ou perda)", artigo: "Art.º 127, n.º 16", multa: "200,00 MT", responsavel: "Condutor" },
      { infracao: "Condução ilegal (nunca teve carta, ou caducada há mais de 30 dias)", artigo: "Art.º 127, n.º 17", multa: "5.000,00 MT + prisão de 3 dias a 6 meses", responsavel: "Condutor" },
      { infracao: "Condução de motociclo com carta válida apenas para ciclomotores", artigo: "Art.º 128, n.º 4", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Condução de veículos B/CI/C com carta válida só para agrícolas", artigo: "Art.º 128, n.º 4", multa: "750,00 MT", responsavel: "Condutor" },
      { infracao: "Condução sem idade mínima ou com licença diplomática indevida", artigo: "Art.º 129, n.º 8", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução com título caducado (carta fora do prazo)", artigo: "Art.º 133, n.º 7", multa: "1.000,00 MT", responsavel: "Condutor" },
      { infracao: "Condução em desobediência a restrições de exame médico", artigo: "Art.º 135, n.º 2", multa: "2.000,00 MT (se não aplicável sanção mais grave)", responsavel: "Condutor" },
    ],
  },
  {
    id: "sancoes-acessorias",
    titulo: "Sanções Acessórias",
    itens: [
      { infracao: "Qualquer infracção não especialmente prevista", artigo: "Art.º 142, n.º 1", multa: "500,00 MT", responsavel: "Condutor, Proprietário ou Peão" },
      { infracao: "Promoção de competições desportivas sem autorização", artigo: "Art.º 147, n.º 1, al. b)", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Manobras perigosas, derrapagens, arranque brusco, arrastamento de pneus", artigo: "Art.º 147, n.º 1, al. c)", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Avançar com sinal vermelho no semáforo ou instrução de agente da PT", artigo: "Art.º 147, n.º 1, al. l)", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Recusa de entrega de documentos de habilitação ao agente da PT", artigo: "Art.º 147, n.º 1, al. r)", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
      { infracao: "Transposição ou circulação em desrespeito de linha contínua", artigo: "Art.º 147, n.º 1, al. v)", multa: "500,00 MT + inibição (1 a 2 anos)", responsavel: "Condutor" },
    ],
  },
  {
    id: "acidentes",
    titulo: "Acidentes de Viação e Abandono de Sinistrado",
    itens: [
      { infracao: "Causar a morte com culpa grave (condutor simples)", artigo: "Art.º 153, n.º 1 e 2", multa: "Prisão de 1 a 3 anos", responsavel: "Condutor" },
      { infracao: "Causar a morte com culpa grave (condutor habitualmente imprudente)", artigo: "Art.º 153, n.º 1 e 2", multa: "Prisão de 6 meses a 2 anos + multa de 6 meses a 2 anos", responsavel: "Condutor" },
      { infracao: "Abandono de sinistrado sem morte", artigo: "Art.º 154, n.º 1, al. a)", multa: "Prisão de 3 dias a 2 anos + multa de 3 dias a 2 anos", responsavel: "Condutor" },
      { infracao: "Abandono de sinistrado havendo morte da vítima", artigo: "Art.º 154, n.º 1, al. b)", multa: "Prisão maior de 2 a 8 anos", responsavel: "Condutor" },
      { infracao: "Abandono depois de verificada a vítima pelo condutor", artigo: "Art.º 154, n.º 1, al. c) e n.º 2", multa: "Pena correspondente ao resultado (pelo menos 1 a 3 anos)", responsavel: "Condutor" },
      { infracao: "Encobridores nos acidentes (passageiros que não se opuseram à fuga)", artigo: "Art.º 154, n.º 3", multa: "Prisão de 3 dias a 6 meses", responsavel: "Passageiro" },
      { infracao: "Falta de prestação de socorro por outros automobilistas (sem morte)", artigo: "Art.º 154, n.º 5", multa: "Prisão de 3 dias a 6 meses + multa correspondente", responsavel: "Outros condutores" },
      { infracao: "Falta de prestação de socorro por outros automobilistas (com morte)", artigo: "Art.º 154, n.º 6", multa: "Prisão de 3 dias a 2 anos + multa correspondente", responsavel: "Outros condutores" },
      { infracao: "Falta de prestação de socorro por parte do peão", artigo: "Art.º 154, n.º 7", multa: "Prisão de 3 dias a 6 meses (ou 2 anos se morte) + multa", responsavel: "Peão" },
    ],
  },
  {
    id: "seguro",
    titulo: "Seguro Obrigatório",
    itens: [
      { infracao: "Circulação sem seguro contra terceiros (Seguro Obrigatório)", artigo: "Art.º 157 e art.º 6 da Lei n.º 2/2003, de 21 de Janeiro", multa: "2 salários mínimos nacionais", responsavel: "Proprietário" },
    ],
  },
  {
    id: "apreensao-titulo",
    titulo: "Apreensão do Título de Propriedade",
    itens: [
      { infracao: "Suspeita de contrafacção, viciação fraudulenta, prazo expirado ou mau estado do livrete", artigo: "Art.º 159, n.º 1, al. a), b) e c)", multa: "Apreensão do título de propriedade do veículo", responsavel: "Condutor/Proprietário" },
      { infracao: "Para efeitos de cassação do título, proibição ou inibição de conduzir", artigo: "Art.º 160, n.º 1", multa: "Apreensão do título de propriedade do veículo", responsavel: "Condutor/Proprietário" },
      { infracao: "Por determinação do INATTER nos termos do Código", artigo: "Art.º 160, n.º 2 a 5", multa: "Apreensão do título de propriedade do veículo", responsavel: "Condutor/Proprietário" },
      { infracao: "Falta de pagamento imediato de multa anterior (15 dias)", artigo: "Art.º 173, n.º 2, al. b)", multa: "Apreensão do título por 15 dias para pagamento voluntário", responsavel: "Proprietário" },
    ],
  },
  {
    id: "apreensao-livrete",
    titulo: "Apreensão do Livrete",
    itens: [
      { infracao: "Suspeita de contrafacção, viciação, prazo expirado ou mau estado do livrete", artigo: "Art.º 161, n.º 1, al. a) e b)", multa: "Apreensão do livrete", responsavel: "Condutor/Proprietário" },
      { infracao: "Acidente com veículo inutilizado", artigo: "Art.º 161, n.º 1, al. c)", multa: "Apreensão do livrete", responsavel: "Condutor/Proprietário" },
      { infracao: "Veículo apreendido, sem condições de segurança, ou transporte público sem comodidade", artigo: "Art.º 161, n.º 1, al. d), e), f)", multa: "Apreensão do livrete", responsavel: "Condutor/Proprietário" },
      { infracao: "Chapa de matrícula irregular ou poluição sonora/ambiental", artigo: "Art.º 161, n.º 1, al. g) e h)", multa: "Apreensão do livrete", responsavel: "Condutor/Proprietário" },
      { infracao: "Características do veículo não conformes (salvo substituições registadas)", artigo: "Art.º 161, n.º 1, al. i) e j)", multa: "Apreensão do livrete", responsavel: "Condutor/Proprietário" },
      { infracao: "Apreensão de outros documentos que acompanham o livrete", artigo: "Art.º 161, n.º 2", multa: "Apreensão dos documentos", responsavel: "Condutor/Proprietário" },
      { infracao: "Condução de veículo/motociclo com documento apreendido", artigo: "Art.º 161, n.º 7", multa: "1.500,00 MT", responsavel: "Condutor/Proprietário" },
      { infracao: "Falta de pagamento imediato de multa anterior (livrete, 15 dias)", artigo: "Art.º 173, n.º 2, al. a)", multa: "Apreensão do livrete por 15 dias para pagamento voluntário", responsavel: "Condutor" },
      { infracao: "Condução de outro veículo a motor com documento apreendido", artigo: "Art.º 161, n.º 7", multa: "750,00 MT", responsavel: "Condutor/Proprietário" },
    ],
  },
  {
    id: "apreensao-veiculos",
    titulo: "Apreensão de Veículos",
    itens: [
      { infracao: "Matrícula não correspondente, inválida, ausente ou documento apreendido", artigo: "Art.º 162, n.º 1, al. a) a d)", multa: "Apreensão do veículo", responsavel: "Proprietário" },
      { infracao: "Falta de registo, acidente sem seguro, livrete incompatível ou anomalias por corrigir", artigo: "Art.º 162, n.º 1, al. e) a i)", multa: "Apreensão do veículo", responsavel: "Proprietário" },
      { infracao: "Não correcção de anomalia 90 dias após apreensão (por negligência)", artigo: "Art.º 162, n.º 2", multa: "Reversão do veículo a favor do Estado", responsavel: "Proprietário" },
    ],
  },
  {
    id: "estacionamento-abusivo",
    titulo: "Estacionamento Indevido ou Abusivo",
    itens: [
      { infracao: "Mais de 30 dias em local público / 5 dias em parques sem pagamento / mais de 2h em locais limitados / mais de 48h com sinais de abandono / sem matrícula", artigo: "Art.º 164, n.º 5 e 6", multa: "Taxa de remoção + 2.000,00 MT", responsavel: "Proprietário" },
    ],
  },
  {
    id: "processo-transgressoes",
    titulo: "Processo de Transgressões",
    itens: [
      { infracao: "Falta de identificação do condutor (arguido) que cometeu a infracção (15 dias)", artigo: "Art.º 171, n.º 7", multa: "1.000,00 MT", responsavel: "Proprietário" },
    ],
  },
];

export const TOTAL_MULTAS = GRUPOS_MULTAS.reduce((acc, g) => acc + g.itens.length, 0);
