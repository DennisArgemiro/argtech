import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface InteractiveBudgetProps {
  onSelectBudget: (serviceName: string, estimatedPrice: number, description: string) => void;
}

export default function InteractiveBudget({ onSelectBudget }: InteractiveBudgetProps) {
  const [selectedService, setSelectedService] = useState<'automacao' | 'software' | 'integracao' | 'infra'>('automacao');
  
  // Custom states per service
  const [pdvCount, setPdvCount] = useState(2); // automacao (number of cashiers)
  const [swComplexity, setSwComplexity] = useState(2); // software (1=Simples, 2=Medio, 3=Complexo)
  const [apiCount, setApiCount] = useState(2); // integracao (number of systems/APIs)
  const [nodesCount, setNodesCount] = useState(10); // infraestrutura (number of computer nodes/racks)
  
  const [includeBackup, setIncludeBackup] = useState(true);
  const [includeSlaSupport, setIncludeSlaSupport] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Recalculate estimated price
  useEffect(() => {
    let base = 0;
    
    switch (selectedService) {
      case 'automacao': {
        base = 2500 + pdvCount * 1200; // base system setup + cashiers
        break;
      }
      case 'software': {
        const mult = swComplexity === 1 ? 8000 : swComplexity === 2 ? 18000 : 35000;
        base = mult;
        break;
      }
      case 'integracao': {
        base = 4000 + apiCount * 2500;
        break;
      }
      case 'infra': {
        base = 3500 + nodesCount * 150;
        break;
      }
    }

    if (includeBackup) { base += 850; }
    if (includeSlaSupport) { base += 1500; }

    setEstimatedPrice(base);
  }, [selectedService, pdvCount, swComplexity, apiCount, nodesCount, includeBackup, includeSlaSupport]);

  const getServiceLabel = () => {
    switch (selectedService) {
      case 'automacao': return 'Automação Comercial';
      case 'software': return 'Desenvolvimento de Software';
      case 'integracao': return 'Integração de Sistemas';
      case 'infra': return 'Instalação e Manutenção';
    }
  };

  const getServiceSpecsSummary = () => {
    let text = `${getServiceLabel()}: `;
    switch (selectedService) {
      case 'automacao':
        text += `${pdvCount} caixas/PDVs`;
        break;
      case 'software':
        text += swComplexity === 1 ? 'ERP Simples' : swComplexity === 2 ? 'ERP/Software Médio' : 'ERP/Software Multi-módulo Complexo';
        break;
      case 'integracao':
        text += `${apiCount} pontes de API`;
        break;
      case 'infra':
        text += `${nodesCount} pontos de rede`;
        break;
    }
    if (includeBackup) {text += ' + Backup Redundante';}
    if (includeSlaSupport) {text += ' + Suporte Contínuo (SLA 24/7)';}
    return text;
  };

  const handleApplyBudget = () => {
    onSelectBudget(getServiceLabel(), estimatedPrice, getServiceSpecsSummary());
  };

  return (
    <section id="budget-simulator" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#3533CD]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-left mb-14">
          <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-3 block">
            TRANSPARÊNCIA TOTAL
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-none">
            Simulador de orçamento
          </h2>
          <p className="font-sans text-[#A8A8A8] text-xs sm:text-sm mt-4 max-w-xl">
            Configure de forma interativa a infraestrutura ou o software que você precisa e tenha uma estimativa orçamentária imediata.
          </p>
        </div>

        {/* Calculator Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Inputs Section */}
          <div 
            className="lg:col-span-7 bg-[#0A0A0A] border border-white/5 p-6 sm:p-8 flex flex-col justify-between text-left rounded-md"
          >
            <div>
              {/* Service Select Header */}
              <label className="font-sans text-xs font-bold uppercase tracking-wider text-white mb-4 block">
                1. Escolha o serviço principal:
              </label>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: 'automacao', label: 'Automação' },
                  { id: 'software', label: 'Software' },
                  { id: 'integracao', label: 'Integrações' },
                  { id: 'infra', label: 'Manutenção' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id as 'automacao' | 'software' | 'integracao' | 'infra')}
                    className={`py-3.5 px-4 rounded-md text-xs font-sans font-bold border transition-all duration-200 cursor-pointer text-center uppercase tracking-wider ${
                      selectedService === s.id
                        ? 'bg-[#3533CD]/10 border-[#3533CD] text-white'
                        : 'bg-[#111] border-white/5 text-[#A8A8A8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Variables */}
              <div className="mb-8 min-h-[140px]">
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-white mb-4 block">
                  2. Ajuste o escopo do projeto:
                </label>

                {selectedService === 'automacao' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-xs sm:text-sm text-[#A8A8A8]">Quantidade de Caixas (PDVs):</span>
                      <span className="font-mono font-bold text-white text-sm sm:text-base">{pdvCount} caixas</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={pdvCount}
                      onChange={(e) => setPdvCount(parseInt(e.target.value))}
                      className="w-full accent-[#3533CD] bg-[#111] rounded-lg h-1.5 cursor-pointer"
                    />
                    <p className="text-[11px] font-sans text-white/50 leading-relaxed">
                      Inclui fiação local de dados, impressoras térmicas SAT homologadas, leitores de código de barras a laser e licenças PDV locais.
                    </p>
                  </div>
                )}

                {selectedService === 'software' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-xs sm:text-sm text-[#A8A8A8]">Complexidade do ERP/Software:</span>
                      <span className="font-sans font-bold text-[#3533CD] text-xs sm:text-sm">
                        {swComplexity === 1 ? 'Simples (Dashboard + Cadastros)' : swComplexity === 2 ? 'Médio (ERP Centralizado + Estoque)' : 'Complexo (Multi-módulos + APIs)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={swComplexity}
                      onChange={(e) => setSwComplexity(parseInt(e.target.value))}
                      className="w-full accent-[#3533CD] bg-[#111] rounded-lg h-1.5 cursor-pointer"
                    />
                    <p className="text-[11px] font-sans text-white/50 leading-relaxed">
                      Sistemas construídos 100% sob medida com design premium, banco de dados hospedado em nuvem e documentação API limpa.
                    </p>
                  </div>
                )}

                {selectedService === 'integracao' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-xs sm:text-sm text-[#A8A8A8]">Sistemas ou APIs a Integrar:</span>
                      <span className="font-mono font-bold text-white text-sm sm:text-base">{apiCount} conexões</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={apiCount}
                      onChange={(e) => setApiCount(parseInt(e.target.value))}
                      className="w-full accent-[#3533CD] bg-[#111] rounded-lg h-1.5 cursor-pointer"
                    />
                    <p className="text-[11px] font-sans text-white/50 leading-relaxed">
                      Desenvolvimento de pipelines seguros de sincronização para fluxos entre ERP, CRM, APIs fiscais, e marketplaces digitais.
                    </p>
                  </div>
                )}

                {selectedService === 'infra' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-xs sm:text-sm text-[#A8A8A8]">Pontos de Computadores / Rede:</span>
                      <span className="font-mono font-bold text-white text-sm sm:text-base">{nodesCount} pontos</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={nodesCount}
                      onChange={(e) => setNodesCount(parseInt(e.target.value))}
                      className="w-full accent-[#3533CD] bg-[#111] rounded-lg h-1.5 cursor-pointer"
                    />
                    <p className="text-[11px] font-sans text-white/50 leading-relaxed">
                      Inclui mapeamento estruturado, crimpagem de conectores de alta performance, configuração de roteadores de nível empresarial e racks locais.
                    </p>
                  </div>
                )}
              </div>

              {/* Add-on toggles */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-white mb-3 block">
                  3. Opcionais de segurança e suporte:
                </label>

                <div 
                  onClick={() => setIncludeBackup(!includeBackup)}
                  className="flex items-center justify-between p-3.5 rounded-md bg-[#111111]/40 border border-white/5 cursor-pointer hover:border-[#3533CD]/40 select-none transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${includeBackup ? 'bg-[#3533CD] border-[#3533CD]' : 'border-white/10'}`}>
                      {includeBackup && <Check className="text-white" size={12} />}
                    </div>
                    <span className="font-sans text-xs text-white font-medium">Backup em Nuvem Redundante</span>
                  </div>
                  <span className="font-mono text-xs text-[#A8A8A8]">+ R$ 850</span>
                </div>

                <div 
                  onClick={() => setIncludeSlaSupport(!includeSlaSupport)}
                  className="flex items-center justify-between p-3.5 rounded-md bg-[#111111]/40 border border-white/5 cursor-pointer hover:border-[#3533CD]/40 select-none transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${includeSlaSupport ? 'bg-[#3533CD] border-[#3533CD]' : 'border-white/10'}`}>
                      {includeSlaSupport && <Check className="text-white" size={12} />}
                    </div>
                    <span className="font-sans text-xs text-white font-medium">Contrato SLA Suporte Contínuo (24/7)</span>
                  </div>
                  <span className="font-mono text-xs text-[#A8A8A8]">+ R$ 1.500/mês</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Price Panel Column */}
          <div 
            className="lg:col-span-5 bg-[#0A0A0A] border border-white/5 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden rounded-md"
            style={{ 
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(53, 51, 205, 0.1) 0%, transparent 50%)'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 bg-[#3533CD]/10 border border-[#3533CD]/20 text-white py-1 px-3 rounded-full w-fit mb-6">
                <Sparkles className="text-[#3533CD]" size={12} />
                <span className="text-[9px] font-mono tracking-widest uppercase">Estimativa Instantânea</span>
              </div>

              <span className="font-sans text-xs uppercase tracking-wider text-[#A8A8A8] block">
                Valor Total Estimado:
              </span>
              <div className="flex items-baseline gap-1.5 mt-2.5 mb-6">
                <span className="font-sans text-xl font-semibold text-[#A8A8A8]">R$</span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-white">
                  {estimatedPrice.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="h-px w-full bg-white/5 mb-6" />

              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white mb-3">
                Resumo da Configuração:
              </h4>
              <ul className="space-y-3 mb-6 text-xs text-[#A8A8A8] font-sans">
                <li className="flex justify-between">
                  <span>Serviço:</span>
                  <span className="text-white font-medium">{getServiceLabel()}</span>
                </li>
                <li className="flex justify-between">
                  <span>Escopo:</span>
                  <span className="text-white font-medium">
                    {selectedService === 'automacao' && `${pdvCount} Caixas`}
                    {selectedService === 'software' && `ERP nível ${swComplexity}`}
                    {selectedService === 'integracao' && `${apiCount} Integrações`}
                    {selectedService === 'infra' && `${nodesCount} Pontos TI`}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Backup Redundante:</span>
                  <span className="text-white font-medium">{includeBackup ? 'Incluso' : 'Não incluso'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Suporte de TI Ativo:</span>
                  <span className="text-white font-medium">{includeSlaSupport ? 'Incluso (SLA 24/7)' : 'Sob Chamado'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleApplyBudget}
              className="relative z-10 w-full group flex items-center justify-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-4 rounded-md transition-all duration-300 cursor-pointer text-center uppercase tracking-wider shadow-md"
            >
              <span>Aplicar no Formulário</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
