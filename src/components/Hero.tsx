import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Code2, Puzzle, Wrench, MessageCircle } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 overflow-hidden bg-[#050505]"
    >
      {/* 1. Diagonal Line & Large Circular Logo (Signature Art) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* The thin white diagonal line */}
        <svg className="absolute w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <line 
            x1="1440" 
            y1="50" 
            x2="-100" 
            y2="950" 
            stroke="rgba(255, 255, 255, 0.15)" 
            strokeWidth="1.5" 
          />
        </svg>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3533CD]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#3533CD]/15 rounded-full blur-[160px]" />
      </div>

      {/* 2. Hero Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 my-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="md:col-span-7 flex flex-col text-left">
          {/* Tagline / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-4"
          >
            ARGTECH
          </motion.div>

          {/* Main Headline (Exactly as pictured in mockup with solid & outline pairing) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none mb-6 flex flex-col"
          >
            <span className="block mb-2">SOLUÇÕES</span>
            <span className="block mb-2 text-white">QUE CONECTAM.</span>
            <span className="text-outline uppercase block font-black leading-tight tracking-wider py-1 select-none">
              TECNOLOGIA QUE
            </span>
            <span className="text-outline uppercase block font-black leading-tight tracking-wider py-1 select-none">
              IMPULSIONA.
            </span>
          </motion.h1>

          {/* Paragraph description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-[#A8A8A8] text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-normal"
          >
            Transformamos desafios em soluções inteligentes para o seu negócio crescer sem limites.
          </motion.p>

          {/* Action Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            {/* Primary Blue Button */}
            <button
              onClick={() => onNavigate('services')}
              id="hero-services-btn"
              className="bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-4 px-8 rounded-md transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#3533CD]/25 text-center cursor-pointer"
            >
              NOSSOS SERVIÇOS
            </button>

            {/* Outlined Button with WhatsApp Icon */}
            <a
              href="https://wa.me/5521987654321"
              target="_blank"
              rel="noopener noreferrer"
              id="hero-whatsapp-btn"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-white text-white font-sans text-xs font-bold py-4 px-8 rounded-md transition-all duration-300 uppercase tracking-wider bg-transparent hover:bg-white/5 text-center cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>FALAR COM ESPECIALISTA</span>
            </a>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="md:col-span-5 mt-8 md:mt-0 h-[300px] sm:h-[350px] md:h-[400px]">
          <HeroCarousel onNavigate={onNavigate} />
        </div>
      </div>

      {/* 3. Middle Horizontal Strip (Bridges Hero & Services, exact design from mockup) */}
      <div className="relative z-10 w-full mt-12 border-t border-b border-[#1A1A1A] bg-[#050505]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          
          {/* Label with lines on left/right */}
          <div className="flex items-center justify-center gap-4 mb-6 md:mb-8 text-center">
            <div className="h-px w-8 md:w-16 bg-[#3533CD]/30" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#3533CD] uppercase">
              TECNOLOGIA DE CONFIANÇA QUE GERA RESULTADOS
            </span>
            <div className="h-px w-8 md:w-16 bg-[#3533CD]/30" />
          </div>

          {/* Desktop Grid Layout (4 columns with separators) */}
          <div className="hidden md:grid grid-cols-4 divide-x divide-[#1A1A1A]">
            
            {/* Col 1 */}
            <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform duration-300">
              <ShoppingCart className="text-[#3533CD] mb-3 group-hover:animate-bounce" size={24} />
              <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                Automação Comercial
              </span>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform duration-300">
              <Code2 className="text-[#3533CD] mb-3 group-hover:animate-bounce" size={24} />
              <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                Desenvolvimento de Software
              </span>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform duration-300">
              <Puzzle className="text-[#3533CD] mb-3 group-hover:animate-bounce" size={24} />
              <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                Integração de Sistemas
              </span>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform duration-300">
              <Wrench className="text-[#3533CD] mb-3 group-hover:animate-bounce" size={24} />
              <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                Instalação e Manutenção
              </span>
            </div>

          </div>

          {/* Mobile Grid Layout (2x2 with cross dividers matching mobile mockup) */}
          <div className="md:hidden grid grid-cols-2 relative border border-[#1A1A1A] rounded-lg overflow-hidden">
            {/* Center dividers using absolute lines */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-[#1A1A1A]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#1A1A1A]" />

            {/* Item 1 */}
            <div className="flex flex-col items-center text-center p-4">
              <ShoppingCart className="text-[#3533CD] mb-2" size={20} />
              <span className="text-[9px] font-bold tracking-wider text-white uppercase">
                Automação Comercial
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center text-center p-4">
              <Code2 className="text-[#3533CD] mb-2" size={20} />
              <span className="text-[9px] font-bold tracking-wider text-white uppercase">
                Desenvolvimento de Software
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center text-center p-4">
              <Puzzle className="text-[#3533CD] mb-2" size={20} />
              <span className="text-[9px] font-bold tracking-wider text-white uppercase">
                Integração de Sistemas
              </span>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center text-center p-4">
              <Wrench className="text-[#3533CD] mb-2" size={20} />
              <span className="text-[9px] font-bold tracking-wider text-white uppercase">
                Instalação e Manutenção
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
