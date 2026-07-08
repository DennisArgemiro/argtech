const heroImage = '/src/assets/images/argtech_hero_banner_1783306907106.jpg';
const serviceAutomacao = '/src/assets/images/argtech_service_automacao_1783306920813.jpg';
const serviceDesenvolvimento = '/src/assets/images/argtech_service_desenvolvimento_1783306934046.jpg';
const serviceIntegracao = '/src/assets/images/argtech_service_integracao_1783306946553.jpg';
const serviceInfraestrutura = '/src/assets/images/argtech_service_infraestrutura_1783306958338.jpg';

import type { ServiceCardData, BenefitData, CaseStudyData, FAQData } from './types';

export const IMAGES = {
  hero: heroImage,
  serviceAutomacao,
  serviceDesenvolvimento,
  serviceIntegracao,
  serviceInfraestrutura,
};

export const SERVICES_DATA: ServiceCardData[] = [
  {
    id: 'automacao',
    title: 'Automação Comercial',
    description: 'Soluções modernas de PDV, controle fiscal e otimização das vendas do seu negócio.',
    longDescription: 'Nossa divisão de Automação Comercial fornece as ferramentas necessárias para agilizar o atendimento ao cliente, otimizar fluxos de caixa e garantir total conformidade fiscal. Desde pequenos comércios a grandes redes de varejo, implementamos soluções completas de frente de caixa com leitor de código de barras, impressoras de cupom fiscal, terminais integrados e sistemas de gestão robustos.',
    icon: 'ShoppingCart',
    image: serviceAutomacao,
    features: [
      'Sistemas de Frente de Caixa (PDV) modernos e rápidos',
      'Integração total com SAT, NFC-e, NF-e e TEF',
      'Controle integrado de estoque e vendas em tempo real',
      'Leitores de código de barras e balanças homologadas',
      'Treinamento presencial e suporte remoto emergencial'
    ]
  },
  {
    id: 'software',
    title: 'Desenvolvimento de Software',
    description: 'Criação de ERPs, aplicações web, mobile e sistemas customizados para sua empresa.',
    longDescription: 'Desenvolvemos sistemas sob medida focados nas necessidades de negócio da sua empresa. Através de metodologias ágeis e tecnologias robustas, nossa equipe de engenharia constrói ERPs corporativos, painéis de controle administrativos (Dashboards), aplicativos web responsivos e soluções integradas que simplificam processos complexos de trabalho.',
    icon: 'Code2',
    image: serviceDesenvolvimento,
    features: [
      'Sistemas ERP e CRM customizados para seu fluxo de trabalho',
      'Plataformas web de alta performance (React/NextJS)',
      'Dashboards interativos com indicadores em tempo real',
      'Aplicativos móveis nativos e híbridos de alta usabilidade',
      'Código limpo, escalável e documentado'
    ]
  },
  {
    id: 'integracao',
    title: 'Integração de Sistemas',
    description: 'Conectamos suas ferramentas favoritas (ERP, CRM, APIs e bancos de dados) sem gargalos.',
    longDescription: 'Garantimos que todas as ferramentas digitais de sua empresa funcionem em perfeita sincronia. Desenvolvemos pontes de dados seguras através de APIs robustas para conectar sistemas legados, softwares SaaS modernos, CRM, portais de pagamento, gateways logísticos e bancos de dados heterogêneos, eliminando erros manuais de redigitação.',
    icon: 'Workflow',
    image: serviceIntegracao,
    features: [
      'Criação de APIs RESTful seguras e escaláveis',
      'Sincronização de estoque e vendas multicanal (Omnichannel)',
      'Integração nativa de ERPs terceiros com plataformas web',
      'Migração inteligente de bancos de dados legados',
      'Automação de fluxos de trabalho (Workflow Automation)'
    ]
  },
  {
    id: 'infraestrutura',
    title: 'Instalação e Manutenção',
    description: 'Instalação, configuração e suporte técnico para manter tudo funcionando.',
    longDescription: 'Sua empresa precisa de uma base física e lógica estável para crescer. Oferecemos soluções completas de infraestrutura de TI, desde o projeto de cabeamento estruturado e redes de computadores até a configuração e monitoramento de racks de servidores locais ou híbridos. Contamos também com serviços recorrentes de manutenção preventiva e suporte de TI de alta performance.',
    icon: 'Wrench',
    image: serviceInfraestrutura,
    features: [
      'Montagem e organização de racks e servidores corporativos',
      'Projetos de cabeamento estruturado e redes Wi-Fi empresariais',
      'Políticas rígidas de Backup em nuvem e segurança de dados',
      'Manutenção preventiva e corretiva de computadores e periféricos',
      'Suporte técnico corporativo com SLA garantido'
    ]
  }
];

export const BENEFITS_DATA: BenefitData[] = [
  {
    title: 'Atendimento Personalizado',
    description: 'Entendemos profundamente os desafios do seu negócio para desenhar a melhor arquitetura de TI.',
    icon: 'Phone'
  },
  {
    title: 'Projetos Sob Medida',
    description: 'Sem soluções genéricas. Desenvolvemos e implementamos exatamente o que sua empresa necessita para crescer.',
    icon: 'Cpu'
  },
  {
    title: 'Suporte Contínuo',
    description: 'Equipe altamente técnica sempre à disposição para resolver dúvidas e restabelecer operações rapidamente.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Tecnologia Atualizada',
    description: 'Trabalhamos com o que há de mais moderno no mercado global de hardware, software e redes.',
    icon: 'Network'
  }
];

export const CASES_DATA: CaseStudyData[] = [
  {
    title: 'Automação Integral de Varejo',
    client: 'Supermercado Nova Era',
    segment: 'Varejo Alimentício',
    description: 'Substituição completa do sistema de caixas obsoleto por uma infraestrutura de automação comercial moderna integrada.',
    results: [
      'Redução de 45% no tempo de atendimento nas filas de caixa',
      'Sincronização instantânea de estoque com emissão fiscal (NFC-e/SAT)',
      'Zero interrupções de hardware durante horários de pico comercial'
    ],
    impact: 'Crescimento de 18% no faturamento mensal devido à agilidade do atendimento.'
  },
  {
    title: 'ERP Customizado e Sincronização de Fluxos',
    client: 'LogisTec Transportes',
    segment: 'Logística e Distribuição',
    description: 'Desenvolvimento de uma plataforma ERP centralizada para monitoramento de rotas de frota, ordens de serviço e faturamento automático.',
    results: [
      'Automatização de 90% das tarefas financeiras manuais',
      'Rastreamento em tempo real do status de 150+ veículos',
      'Integração direta com o sistema de emissão de CTe'
    ],
    impact: 'Economia operacional de R$ 45.000,00 nos primeiros 6 meses de implantação.'
  },
  {
    title: 'Consolidação de Redes e Servidores',
    client: 'Metalúrgica Aliança',
    segment: 'Indústria Pesada',
    description: 'Reestruturação total do cabeamento de rede industrial e centralização de servidores locais com backup redundante em nuvem.',
    results: [
      'Aumento de 10x na velocidade de transferência interna de dados',
      'Blindagem de segurança contra ransomwares e invasões corporativas',
      'Uptime da infraestrutura de informática mantido em 99.99%'
    ],
    impact: 'Proteção total dos projetos industriais confidenciais e eliminação de perdas de dados.'
  }
];

export const FAQS_DATA: FAQData[] = [
  {
    question: 'Vocês atendem apenas empresas da Grande São Paulo?',
    answer: 'Atendemos presencialmente toda a Grande São Paulo e região do ABC para projetos de infraestrutura física e automação comercial local. Para desenvolvimento de software e integrações de sistemas, atendemos empresas de qualquer localidade do Brasil através de reuniões e implantação 100% remotas.'
  },
  {
    question: 'Como funciona o suporte técnico mensal para computadores e redes?',
    answer: 'Oferecemos contratos de suporte de TI preventivo e corretivo (SLA) para empresas. Nossa equipe monitora a rede, realiza backups programados, atualiza softwares e está disponível para chamados remotos e visitas presenciais emergenciais.'
  },
  {
    question: 'Os softwares e ERPs são proprietários ou feitos sob medida?',
    answer: 'Nós desenvolvemos soluções de software 100% sob medida para sua empresa. Isso significa que sua empresa é dona do projeto e o sistema se adapta exatamente ao seu fluxo de trabalho, sem licenças abusivas por usuário.'
  },
  {
    question: 'Vocês vendem e configuram as impressoras de cupom fiscal e leitores?',
    answer: 'Sim! Entregamos a solução de automação comercial chave na mão ("turnkey"). Nós fornecemos os equipamentos ideais homologados pelas leis fiscais (SAT, impressoras térmicas, balanças, leitores), realizamos toda a fiação, configuração do sistema e treinamento da equipe.'
  },
  {
    question: 'Qual o prazo médio para o desenvolvimento de um sistema personalizado?',
    answer: 'Os prazos variam de acordo com o escopo e complexidade do projeto. Um sistema web ou dashboard inicial pode ser entregue em 4 a 6 semanas, enquanto um ERP corporativo completo pode levar de 3 a 5 meses, dividido em entregas funcionais periódicas.'
  }
];
