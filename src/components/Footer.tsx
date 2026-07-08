import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Linkedin } from 'lucide-react';
import ArgtechLogo from './ArgtechLogo';
import { useFooterInfo } from '../hooks/useFooterInfo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { footerInfo } = useFooterInfo();

  return (
    <div className="bg-[#050505]">
      
      {/* 1. Final CTA Banner Section (Pronto para levar sua empresa...) - Exact design from mockup */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div 
          className="relative overflow-hidden bg-[#0A0A0A] border border-white/5 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 rounded-lg"
          style={{
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(53, 51, 205, 0.05)'
          }}
        >
          {/* Subtle neon glowing border bar */}
          <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-[#3533CD]" />

          {/* Left Text */}
          <div className="text-left md:max-w-xl">
            <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
              Pronto para levar sua empresa para o próximo nível?
            </h3>
            <p className="font-sans text-[#A8A8A8] text-xs sm:text-sm">
              Fale com a nossa equipe e descubra a melhor solução para o seu negócio.
            </p>
          </div>

          {/* Right Button & Phone Info */}
          <div className="flex flex-col items-start md:items-end shrink-0 gap-3">
            <a
              href={`https://wa.me/${footerInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              id="footer-cta-whatsapp"
              className="flex items-center justify-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-4 px-8 rounded-md transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#3533CD]/20"
            >
              <MessageCircle size={16} />
              <span>FALE CONOSCO</span>
            </a>

            {/* Direct Phone Number Line */}
            <div className="flex items-center gap-2 text-white/85 font-sans font-semibold text-xs tracking-wider mt-1 hover:text-[#3533CD] transition-colors">
              <Phone size={14} className="text-[#3533CD]" />
              <span>{footerInfo.phone}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Corporate Footer */}
      <footer id="footer" className="border-t border-white/5 bg-[#050505] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Upper Footer: Logo block, Nav map, Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 text-left items-start">
            
            {/* Column 1: Brand details & Social icons */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <ArgtechLogo size={50} />
                <div>
                  <span className="font-sans font-extrabold tracking-tight text-white text-lg block uppercase leading-none">
                    Argtech
                  </span>
                  <span className="text-[10px] font-mono text-[#A8A8A8] tracking-widest uppercase block mt-1">
                    Soluções em Informática
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs text-[#A8A8A8] leading-relaxed max-w-sm font-light">
                ARGTECH SOLUÇÕES EM INFORMÁTICA.<br />
                Tecnologia que conecta. Soluções que transformam.
              </p>

              {/* Social Icons exactly matching mockup style */}
              <div className="flex items-center gap-4 pt-2">
                <a 
                  href={footerInfo.whatsapp ? `https://wa.me/${footerInfo.whatsapp}` : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#A8A8A8] hover:text-white hover:border-white transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
                <a 
                  href={footerInfo.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#A8A8A8] hover:text-white hover:border-white transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a 
                  href={footerInfo.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#A8A8A8] hover:text-white hover:border-white transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Map */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#3533CD]">
                NAVEGAÇÃO
              </h4>
              <ul className="space-y-3 text-xs text-[#A8A8A8] font-medium">
                <li>
                  <button 
                    onClick={() => onNavigate('hero')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('services')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Serviços
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('about')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('projects')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Projetos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('contact')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact information exactly matching mockup */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#3533CD]">
                CONTATO
              </h4>
              <ul className="space-y-4 text-xs text-[#A8A8A8]">
                <li className="flex items-center gap-3">
                  <Phone size={14} className="text-[#3533CD] shrink-0" />
                  <span>{footerInfo.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={14} className="text-[#3533CD] shrink-0" />
                  <span>{footerInfo.email}</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={14} className="text-[#3533CD] shrink-0" />
                  <span>{footerInfo.address}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Lower Copyright line */}
          <div className="pt-8 border-t border-white/5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-[#A8A8A8] font-normal">
            <p>© {currentYear} Argtech Soluções em Informática. Todos os direitos reservados.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}