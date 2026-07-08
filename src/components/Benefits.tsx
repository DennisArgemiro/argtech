import React from 'react';
import { motion } from 'motion/react';
import { Check, Users, Shield, Rocket, BarChart3, MessageCircle } from 'lucide-react';
import ArgtechLogo from './ArgtechLogo';
import { useFooterInfo } from '../hooks/useFooterInfo';

export default function Benefits() {
  const { footerInfo } = useFooterInfo();
  return (
    <section id="benefits" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#3533CD]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Main Grid: Left side content, Right side graphics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Title & Checkmarks */}
          <div className="lg:col-span-6 text-left flex flex-col justify-center">
            
            <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-3 block">
              POR QUE ESCOLHER A ARGTECH?
            </span>
            
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-tight mb-8">
              Tecnologia com propósito.<br />Resultados que ficam.
            </h2>

            {/* List of 4 exact checkmark benefits from mockup */}
            <div className="flex flex-col gap-6 mb-10">
              
              {/* Benefit 1 */}
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-[#3533CD]/10 border border-[#3533CD]/30 flex items-center justify-center shrink-0">
                  <Check className="text-[#3533CD]" size={12} strokeWidth={3} />
                </div>
                <span className="font-sans text-sm sm:text-base text-white/95 font-medium">
                  Atendimento próximo e personalizado
                </span>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-[#3533CD]/10 border border-[#3533CD]/30 flex items-center justify-center shrink-0">
                  <Check className="text-[#3533CD]" size={12} strokeWidth={3} />
                </div>
                <span className="font-sans text-sm sm:text-base text-white/95 font-medium">
                  Soluções sob medida para cada negócio
                </span>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-[#3533CD]/10 border border-[#3533CD]/30 flex items-center justify-center shrink-0">
                  <Check className="text-[#3533CD]" size={12} strokeWidth={3} />
                </div>
                <span className="font-sans text-sm sm:text-base text-white/95 font-medium">
                  Tecnologia atualizada e segura
                </span>
              </div>

              {/* Benefit 4 */}
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-[#3533CD]/10 border border-[#3533CD]/30 flex items-center justify-center shrink-0">
                  <Check className="text-[#3533CD]" size={12} strokeWidth={3} />
                </div>
                <span className="font-sans text-sm sm:text-base text-white/95 font-medium">
                  Compromisso com resultados reais
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Orbital Diagram & Text Callout */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Elegant Orbital Diagram */}
            <div className="relative w-72 sm:w-80 aspect-square flex items-center justify-center mb-10 select-none">
              
              {/* Outer dashed track */}
              <div className="absolute w-[95%] h-[95%] rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />
              
              {/* Middle track */}
              <div className="absolute w-[75%] h-[75%] rounded-full border border-white/5 animate-[spin_40s_linear_infinite]" />
              
              {/* Inner track */}
              <div className="absolute w-[55%] h-[55%] rounded-full border border-white/10" />

              {/* Orbit Nodes with Icons */}
              {/* Top-Left Node (Users) */}
              <motion.div 
                className="absolute top-2 left-6 w-11 h-11 rounded-full bg-[#0A0A0A] border border-[#3533CD]/30 flex items-center justify-center shadow-lg shadow-[#3533CD]/10 cursor-help"
                whileHover={{ scale: 1.1, borderColor: '#3533CD' }}
                title="Atendimento"
              >
                <Users size={16} className="text-[#3533CD]" />
              </motion.div>

              {/* Top-Right Node (Shield) */}
              <motion.div 
                className="absolute top-2 right-6 w-11 h-11 rounded-full bg-[#0A0A0A] border border-[#3533CD]/30 flex items-center justify-center shadow-lg shadow-[#3533CD]/10 cursor-help"
                whileHover={{ scale: 1.1, borderColor: '#3533CD' }}
                title="Segurança"
              >
                <Shield size={16} className="text-[#3533CD]" />
              </motion.div>

              {/* Bottom-Left Node (Rocket) */}
              <motion.div 
                className="absolute bottom-2 left-6 w-11 h-11 rounded-full bg-[#0A0A0A] border border-[#3533CD]/30 flex items-center justify-center shadow-lg shadow-[#3533CD]/10 cursor-help"
                whileHover={{ scale: 1.1, borderColor: '#3533CD' }}
                title="Rapidez & Escalabilidade"
              >
                <Rocket size={16} className="text-[#3533CD]" />
              </motion.div>

              {/* Bottom-Right Node (BarChart3) */}
              <motion.div 
                className="absolute bottom-2 right-6 w-11 h-11 rounded-full bg-[#0A0A0A] border border-[#3533CD]/30 flex items-center justify-center shadow-lg shadow-[#3533CD]/10 cursor-help"
                whileHover={{ scale: 1.1, borderColor: '#3533CD' }}
                title="Resultados"
              >
                <BarChart3 size={16} className="text-[#3533CD]" />
              </motion.div>

              {/* Center ARG TECH emblem */}
              <div className="relative z-10 w-36 h-36 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center shadow-2xl">
                <ArgtechLogo size={144} />
              </div>
            </div>

            {/* Custom Description Block below the Diagram */}
            <div className="w-full max-w-sm text-left border-t border-white/5 pt-8 flex flex-col items-start">
              
              {/* Mini Blue Divider Line as shown in Mockup */}
              <div className="w-12 h-[3px] bg-[#3533CD] mb-4" />
              
              <p className="font-sans text-white text-base font-semibold leading-relaxed mb-6">
                Do planejamento à execução, estamos com você em cada etapa.
              </p>

              {/* CTA button Falar com Especialista */}
              <a
                href={`https://wa.me/${footerInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                id="benefits-specialist-cta"
                className="flex items-center justify-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-3.5 px-6 rounded-md transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#3533CD]/20"
              >
                <MessageCircle size={16} />
                <span>FALAR COM ESPECIALISTA</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
