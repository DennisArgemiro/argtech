import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CASES_DATA } from '../data';
import { Check, Award, TrendingUp } from 'lucide-react';

export default function Cases() {
  const [activeTab, setActiveTab] = useState(0);

  const activeCase = CASES_DATA[activeTab];

  return (
    <section id="cases" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3533CD]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <div className="text-left mb-16">
          <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-3 block">
            HISTÓRIAS DE TRANSFORMAÇÃO
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-none">
            Nossos cases de sucesso
          </h2>
          <p className="font-sans text-[#A8A8A8] text-xs sm:text-sm mt-4 max-w-xl">
            Resultados mensuráveis entregues para empresas reais que decidiram atualizar sua tecnologia e automação comercial com a nossa ajuda.
          </p>
        </div>

        {/* Tab Selectors - Geometric & Clean */}
        <div className="flex flex-wrap gap-2 mb-10 bg-[#0A0A0A] p-1.5 border border-white/5 rounded-md max-w-xl">
          {CASES_DATA.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-3 px-4 rounded-md text-xs font-sans font-bold transition-all cursor-pointer focus:outline-none uppercase tracking-wider ${
                activeTab === i 
                  ? 'bg-[#3533CD] text-white shadow-md shadow-[#3533CD]/15' 
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              {c.client}
            </button>
          ))}
        </div>

        {/* Active Case Card Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0A0A0A] border border-white/5 p-8 rounded-lg text-left"
              style={{
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              {/* Left text area (Details & Results) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Segment Tag */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#3533CD] font-bold uppercase tracking-widest mb-4">
                    <Award size={14} />
                    <span>{activeCase?.segment}</span>
                  </div>

                  <h3 className="font-sans text-xl sm:text-2xl font-black text-white leading-tight mb-4 uppercase tracking-tight">
                    {activeCase?.title}
                  </h3>

                  <p className="font-sans text-[#A8A8A8] text-xs sm:text-sm leading-relaxed font-light mb-8">
                    {activeCase?.description}
                  </p>

                  {/* Results Checklist */}
                  <div className="space-y-4 mb-8">
                    <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
                      Resultados Alcançados:
                    </h4>
                    {activeCase?.results.map((result, ri) => (
                      <div key={ri} className="flex items-start gap-2.5">
                        <div className="p-0.5 bg-[#3533CD]/10 border border-[#3533CD]/20 text-[#3533CD] rounded-md mt-0.5 shrink-0">
                          <Check size={12} />
                        </div>
                        <span className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                          {result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Impact Quote / Highlight */}
                <div className="mt-4 pt-6 border-t border-white/5 flex items-center gap-3">
                  <div className="p-2.5 bg-[#3533CD]/10 text-[#3533CD] rounded-md">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#A8A8A8] tracking-widest block font-bold">Impacto de Negócio</span>
                    <span className="font-sans text-xs text-white font-semibold">{activeCase?.impact}</span>
                  </div>
                </div>
              </div>

              {/* Right graphical widget (Metrics cards) */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4 bg-[#111111]/40 border border-white/5 p-6 rounded-md">
                <h4 className="font-mono text-[9px] text-[#A8A8A8] uppercase tracking-widest text-left mb-2 block border-b border-white/5 pb-2 font-bold">
                  MÉTRICAS DE SUCESSO
                </h4>
                
                {/* Visual circular/progress card */}
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-md bg-[#3533CD]/10 border border-[#3533CD]/20 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                    A+
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#A8A8A8] uppercase block">Satisfação do Cliente</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white">NPS Superior a 95</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-md bg-[#3533CD]/10 border border-[#3533CD]/20 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                    99%
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#A8A8A8] uppercase block">Conformidade Legal</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white">Adequação Fiscal Completa</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-md bg-[#3533CD]/10 border border-[#3533CD]/20 flex items-center justify-center font-mono text-xs font-bold text-[#3533CD] shrink-0">
                    SLA
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#A8A8A8] uppercase block">Tempo de Resposta</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white">Atendimento em Menos de 1h</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}