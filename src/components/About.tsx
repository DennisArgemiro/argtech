import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#3533CD]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 text-left">
            <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-3 block">
              QUEM SOMOS
            </span>
            
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-tight mt-2 mb-6">
              Inovação Tecnológica com Foco no Seu Negócio
            </h2>
            
            <p className="font-sans text-[#A8A8A8] text-sm sm:text-base leading-relaxed mb-6 font-light">
              A <strong className="text-white font-semibold">Argtech Soluções em Informática</strong> nasceu com o propósito de simplificar a tecnologia para as empresas brasileiras. Entendemos que de nada servem sistemas complexos se eles não gerarem agilidade operacional e aumento no faturamento real.
            </p>
            
            <p className="font-sans text-[#A8A8A8] text-sm sm:text-base leading-relaxed mb-8 font-light">
              Nossa equipe é formada por engenheiros de redes, desenvolvedores seniores e especialistas em legislação fiscal. Atuamos desde a estruturação de racks de servidores físicos e infraestrutura Wi-Fi de alta densidade até a programação de ERPs personalizados e integração de frentes de caixa de alta performance.
            </p>

            {/* Quick business attributes list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3 bg-[#0A0A0A] border border-white/5 p-4 rounded-md">
                <div className="p-2.5 bg-[#3533CD]/10 text-[#3533CD] rounded-md h-fit">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-white mb-1">Segurança de Dados</h4>
                  <p className="font-sans text-xs text-[#A8A8A8]">Backups redundantes automatizados e proteção de perímetro.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-[#0A0A0A] border border-white/5 p-4 rounded-md">
                <div className="p-2.5 bg-[#3533CD]/10 text-[#3533CD] rounded-md h-fit">
                  <Activity size={18} />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-white mb-1">Operação Ininterrupta</h4>
                  <p className="font-sans text-xs text-[#A8A8A8]">Monitoramento ativo para evitar gargalos em servidores e PDVs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image or Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#0A0A0A] border border-white/5 p-8 text-left relative rounded-md overflow-hidden"
            style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#3533CD]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="font-mono text-[10px] text-[#3533CD] uppercase tracking-widest font-bold block mb-4">
                NOSSA EQUipe
              </span>
              <h3 className="font-sans text-2xl font-extrabold text-white tracking-tight mb-4">
                Especialistas em Tecnologia
              </h3>
              <p className="font-sans text-[#A8A8A8] text-sm leading-relaxed font-light mb-6">
                Combinamos expertise técnica com visão de negócio para entregar soluções que realmente fazem diferença na operação da sua empresa.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3533CD] rounded-full" />
                  <span className="font-sans text-xs text-white/80">Engenheiros de Redes Certificados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3533CD] rounded-full" />
                  <span className="font-sans text-xs text-white/80">Desenvolvedores Seniores Full Stack</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3533CD] rounded-full" />
                  <span className="font-sans text-xs text-white/80">Especialistas em Legislação Fiscal</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
