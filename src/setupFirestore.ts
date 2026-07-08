// Firebase Firestore Setup Script
// Run this after setting up your Firebase project

import 'dotenv/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

async function setupFirestore() {
  console.log('Setting up Firestore...');

  // Check if data already exists
  const textsSnapshot = await getDocs(collection(db, 'site_texts'));
  if (!textsSnapshot.empty) {
    console.log('Data already exists. Skipping setup.');
    return;
  }

  // Add site texts
  const texts = [
    // Hero
    { section: 'hero', key: 'tagline', value: 'ARGTECH' },
    { section: 'hero', key: 'title_line1', value: 'SOLUÇÕES' },
    { section: 'hero', key: 'title_line2', value: 'QUE CONECTAM.' },
    { section: 'hero', key: 'title_line3', value: 'TECNOLOGIA QUE' },
    { section: 'hero', key: 'title_line4', value: 'IMPULSIONA.' },
    { section: 'hero', key: 'description', value: 'Transformamos desafios em soluções inteligentes para o seu negócio crescer sem limites.' },
    { section: 'hero', key: 'cta_primary', value: 'NOSSOS SERVIÇOS' },
    { section: 'hero', key: 'cta_secondary', value: 'FALAR COM ESPECIALISTA' },
    
    // Services
    { section: 'services', key: 'tagline', value: 'NOSSOS SERVIÇOS' },
    { section: 'services', key: 'title', value: 'Soluções completas para o seu negócio' },
    { section: 'services', key: 'description', value: 'Oferecemos tecnologia sob medida para otimizar processos, integrar sistemas e impulsionar resultados.' },
    
    // Benefits
    { section: 'benefits', key: 'tagline', value: 'POR QUE ESCOLHER A ARGTECH?' },
    { section: 'benefits', key: 'title', value: 'Tecnologia com propósito. Resultados que ficam.' },
    
    // Contact
    { section: 'contact', key: 'title', value: 'Pronto para levar sua empresa para o próximo nível?' },
    { section: 'contact', key: 'description', value: 'Fale com a nossa equipe e descubra a melhor solução para o seu negócio.' },
    
    // Footer
    { section: 'footer', key: 'company_name', value: 'ARGTECH SOLUÇÕES EM INFORMÁTICA' },
    { section: 'footer', key: 'slogan', value: 'Tecnologia que conecta. Soluções que transformam.' },
  ];

  for (const text of texts) {
    await addDoc(collection(db, 'site_texts'), text);
  }
  console.log('Added site texts');

  // Add navigation items
  const navigation = [
    { label: 'Início', href: '#hero', order_index: 1, visible: true },
    { label: 'Serviços', href: '#services', order_index: 2, visible: true },
    { label: 'Benefícios', href: '#benefits', order_index: 3, visible: true },
    { label: 'Contato', href: '#contact', order_index: 4, visible: true },
  ];

  for (const item of navigation) {
    await addDoc(collection(db, 'navigation'), item);
  }
  console.log('Added navigation items');

  // Add contacts
  const contacts = [
    { type: 'phone', value: '(XX) XXXX-XXXX', label: 'Telefone', visible: true },
    { type: 'email', value: 'contato@argtech.com.br', label: 'Email', visible: true },
    { type: 'whatsapp', value: '5521987654321', label: 'WhatsApp', visible: true },
  ];

  for (const contact of contacts) {
    await addDoc(collection(db, 'contacts'), contact);
  }
  console.log('Added contacts');

  // Add services
  const services = [
    {
      title: 'Automação Comercial',
      description: 'Soluções completas para otimizar sua gestão e aumentar sua produtividade.',
      long_description: 'Nossa divisão de Automação Comercial fornece as ferramentas necessárias para agilizar o atendimento ao cliente, otimizar fluxos de caixa e garantir total conformidade fiscal. Desde pequenos comércios a grandes redes de varejo, implementamos soluções completas de frente de caixa com leitor de código de barras, impressoras de cupom fiscal, terminais integrados e sistemas de gestão robustos.',
      icon: 'ShoppingCart',
      image_url: '',
      order_index: 1,
      visible: true
    },
    {
      title: 'Desenvolvimento de Software',
      description: 'Sistemas personalizados para atender às necessidades do seu negócio.',
      long_description: 'Desenvolvemos sistemas sob medida focados nas necessidades de negócio da sua empresa. Através de metodologias ágeis e tecnologias robustas, nossa equipe de engenharia constrói ERPs corporativos, painéis de controle administrativos (Dashboards), aplicativos web responsivos e soluções integradas que simplificam processos complexos de trabalho.',
      icon: 'Code2',
      image_url: '',
      order_index: 2,
      visible: true
    },
    {
      title: 'Integração de Sistemas',
      description: 'Conectamos sistemas e plataformas para uma operação mais eficiente.',
      long_description: 'Garantimos que todas as ferramentas digitais de sua empresa funcionem em perfeita sincronia. Desenvolvemos pontes de dados seguras através de APIs robustas para conectar sistemas legados, softwares SaaS modernos, CRM, portais de pagamento, gateways logísticos e bancos de dados heterogêneos, eliminando erros manuais de redigitação.',
      icon: 'Workflow',
      image_url: '',
      order_index: 3,
      visible: true
    },
    {
      title: 'Instalação e Manutenção',
      description: 'Instalação, configuração e suporte técnico para manter tudo funcionando.',
      long_description: 'Sua empresa precisa de uma base física e lógica estável para crescer. Oferecemos soluções completas de infraestrutura de TI, desde o projeto de cabeamento estruturado e redes de computadores até a configuração e monitoramento de racks de servidores locais ou híbridos. Contamos também com serviços recorrentes de manutenção preventiva e suporte de TI de alta performance.',
      icon: 'Wrench',
      image_url: '',
      order_index: 4,
      visible: true
    }
  ];

  for (const service of services) {
    await addDoc(collection(db, 'services'), service);
  }
  console.log('Added services');

  // Projects collection will be populated via Admin Dashboard
  console.log('Projects collection ready for admin management');

  // Add carousel slides
  const carouselSlides = [
    {
      image: '/src/assets/images/argtech_hero_banner_1783306907106.jpg',
      title: 'Soluções que Conectam',
      subtitle: 'Tecnologia que Impulsiona',
      order_index: 1,
      visible: true
    },
    {
      image: '/src/assets/images/argtech_service_automacao_1783306920813.jpg',
      title: 'Automação Comercial',
      subtitle: 'Otimize sua gestão',
      order_index: 2,
      visible: true
    },
    {
      image: '/src/assets/images/argtech_service_desenvolvimento_1783306934046.jpg',
      title: 'Desenvolvimento',
      subtitle: 'Sistemas personalizados',
      order_index: 3,
      visible: true
    },
    {
      image: '/src/assets/images/argtech_service_infraestrutura_1783306958338.jpg',
      title: 'Infraestrutura',
      subtitle: 'Suporte completo',
      order_index: 4,
      visible: true
    },
    {
      image: '/src/assets/images/argtech_service_integracao_1783306946553.jpg',
      title: 'Integração',
      subtitle: 'Sistemas conectados',
      order_index: 5,
      visible: true
    }
  ];

  for (const slide of carouselSlides) {
    await addDoc(collection(db, 'carousel_slides'), slide);
  }
  console.log('Added carousel slides');

  console.log('Firestore setup complete!');
}

// Run setup
setupFirestore().catch(console.error);
