import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES_DATA } from '../data';
import type { ServiceCardData } from '../types';
import { ShoppingCart, Code2, Puzzle, Wrench, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

// Icon mapper for service cards
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShoppingCart':
      return <ShoppingCart className="text-[#3533CD]" size={28} />;
    case 'Code2':
      return <Code2 className="text-[#3533CD]" size={28} />;
    case 'Workflow':
    case 'Puzzle':
      return <Puzzle className="text-[#3533CD]" size={28} />;
    case 'Wrench':
      return <Wrench className="text-[#3533CD]" size={28} />;
    default:
      return <Code2 className="text-[#3533CD]" size={28} />;
  }
};

export default function Services({ onSelectService }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceCardData | null>(null);

  const handleOpenModal = (service: ServiceCardData) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleRequestService = (title: string) => {
    onSelectService(title);
    handleCloseModal();
  };

  return (
    <section id="services" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Absolute Ambient Background Decor */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#3533CD]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Split Header matching Mockup Image 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16">
          <div className="md:col-span-7 text-left">
            <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase block mb-3">
              NOSSOS SERVIÇOS
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-none">
              Soluções completas<br />para o seu negócio
            </h2>
          </div>
          <div className="md:col-span-5 text-left md:text-right">
            <p className="font-sans text-[#A8A8A8] text-sm md:text-base leading-relaxed max-w-md ml-auto">
              Oferecemos tecnologia sob medida para otimizar processos, integrar sistemas e impulsionar resultados.
            </p>
          </div>
        </div>

        {/* 4-Card Elegant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service, idx) => {
            // Adjust title and description to match the mockup exact wording if needed
            const displayTitle = service.title.toUpperCase();
            let displayDesc = service.description;

            // Mockup text overrides for highest exact visual fidelity
            if (service.id === 'automacao') {
              displayDesc = 'Soluções completas para otimizar sua gestão e aumentar sua produtividade.';
            } else if (service.id === 'software') {
              displayDesc = 'Sistemas personalizados para atender às necessidades do seu negócio.';
            } else if (service.id === 'integracao') {
              displayDesc = 'Conectamos sistemas e plataformas para uma operação mais eficiente.';
            } else if (service.id === 'infraestrutura') {
              displayDesc = 'Instalação, configuração e suporte técnico para manter tudo funcionando.';
            }

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleOpenModal(service)}
                className="group cursor-pointer bg-[#0A0A0A] border border-white/5 hover:border-[#3533CD]/40 p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative text-left rounded-md"
                id={`service-card-${service.id}`}
              >
                {/* Active hover neon light bar on top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3533CD]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Icon on top */}
                  <div className="mb-8 w-12 h-12 flex items-center justify-start">
                    {getServiceIcon(service.icon)}
                  </div>

                  {/* Uppercase Clean Title */}
                  <h3 className="font-sans text-sm font-bold text-white tracking-wider uppercase mb-4 group-hover:text-[#3533CD] transition-colors duration-300">
                    {displayTitle}
                  </h3>

                  {/* Minimal Description */}
                  <p className="font-sans text-[#A8A8A8] text-xs leading-relaxed mb-8">
                    {displayDesc}
                  </p>
                </div>

                {/* Saiba Mais Link */}
                <div className="flex items-center gap-1.5 text-[#3533CD] font-sans text-[10px] font-bold uppercase tracking-widest mt-auto group-hover:text-white transition-colors duration-300">
                  <span>SAIBA MAIS</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal (Preserves all rich features and details) */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={handleCloseModal} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 overflow-y-auto max-h-[90vh] shadow-2xl z-10 p-8 rounded-lg"
              id="service-detail-modal"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 bg-[#111111] border border-white/5 text-[#A8A8A8] hover:text-white rounded-md transition-colors cursor-pointer focus:outline-none"
              >
                <X size={18} />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col text-left">
                {/* Header block with Icon */}
                <div className="flex items-center gap-4 mb-6 mt-2">
                  <div className="p-3.5 bg-[#3533CD]/10 border border-[#3533CD]/20 rounded-md">
                    {getServiceIcon(selectedService.icon)}
                  </div>
                  <div>
                    <h4 className="font-sans text-xl font-bold text-white uppercase tracking-wider">
                      {selectedService.title}
                    </h4>
                    <p className="text-[10px] font-mono text-[#A8A8A8] tracking-widest uppercase mt-0.5">
                      Argtech Soluções Corporativas
                    </p>
                  </div>
                </div>

                {/* Hero preview in modal */}
                <div className="w-full aspect-[16/6] rounded-md overflow-hidden border border-white/5 mb-6">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover filter brightness-[0.7]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Long description */}
                <p className="font-sans text-xs text-[#A8A8A8] leading-relaxed font-light mb-6">
                  {selectedService.longDescription}
                </p>

                {/* Features Checklist */}
                <div className="mb-8">
                  <h5 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
                    O que está incluso:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedService.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-[#3533CD] shrink-0 mt-0.5" size={14} />
                        <span className="font-sans text-xs text-white/90 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                  <button
                    onClick={() => handleRequestService(selectedService.title)}
                    className="flex-1 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-3.5 rounded-md transition-all duration-200 cursor-pointer text-center uppercase tracking-wider"
                  >
                    Solicitar Orçamento
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-transparent hover:bg-white/5 text-[#A8A8A8] hover:text-white border border-white/10 font-sans text-xs font-bold py-3.5 rounded-md transition-all duration-200 cursor-pointer text-center uppercase tracking-wider"
                  >
                    Voltar
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
