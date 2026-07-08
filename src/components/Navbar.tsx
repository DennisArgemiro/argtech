import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ArgtechLogo from './ArgtechLogo';
import { useFooterInfo } from '../hooks/useFooterInfo';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

const NAV_ITEMS = [
  { label: 'INÍCIO', id: 'hero' },
  { label: 'SERVIÇOS', id: 'services' },
  { label: 'SOBRE NÓS', id: 'about' },
  { label: 'PROJETOS', id: 'projects' },
  { label: 'CONTATO', id: 'contact' },
];

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { footerInfo } = useFooterInfo();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#050505]/95 border-b border-[#1A1A1A] shadow-lg backdrop-blur-md py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo with title next to it */}
          <button 
            onClick={() => handleItemClick('hero')} 
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
            id="nav-logo"
          >
            <ArgtechLogo size={46} />
            <div className="text-left hidden xs:block">
              <span className="font-sans font-extrabold text-white text-lg block leading-none tracking-tight uppercase group-hover:text-[#3533CD] transition-colors duration-300">
                Argtech
              </span>
              <span className="text-[9px] font-mono text-[#A8A8A8] tracking-widest uppercase block mt-0.5">
                Soluções em Informática
              </span>
            </div>
          </button>

          {/* Center Navigation Links - Uppercase & Clean styling */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  id={`nav-item-${item.id.toLowerCase()}`}
                  className={`relative font-sans text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer focus:outline-none ${
                    isActive ? 'text-[#3533CD]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#3533CD]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Button - Fale Conosco with blue outline and phone/whatsapp icon */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`https://wa.me/${footerInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-nav"
              className="flex items-center gap-2 border border-[#3533CD] text-[#3533CD] hover:bg-[#3533CD] hover:text-white font-sans text-xs font-bold py-2.5 px-5 rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider"
            >
              <MessageCircle size={14} className="fill-[#3533CD] group-hover:fill-white" />
              <span>Fale Conosco</span>
            </a>
          </div>

          {/* Mobile elements (CTA + Hamburger) */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href={`https://wa.me/${footerInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-nav-mobile"
              className="flex items-center gap-1.5 border border-[#3533CD] text-[#3533CD] hover:bg-[#3533CD] hover:text-white font-sans text-[10px] font-bold py-1.5 px-3.5 rounded-full transition-all duration-300 uppercase tracking-wider"
            >
              <MessageCircle size={12} />
              <span>Fale Conosco</span>
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-trigger"
              className="p-2 text-white/80 hover:text-white cursor-pointer focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md md:hidden flex flex-col justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-11/12 max-w-sm bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-8"
            >
              <div className="flex flex-col items-center gap-3">
                <ArgtechLogo size={61} />
                <div className="text-center">
                  <span className="font-sans font-extrabold tracking-tight text-white text-xl uppercase block">
                    Argtech
                  </span>
                  <span className="text-[10px] font-mono text-[#A8A8A8] tracking-widest uppercase block mt-1">
                    Soluções em Informática
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-[#1A1A1A]" />

              <div className="flex flex-col gap-4 w-full text-center">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      id={`mobile-nav-item-${item.id}`}
                      className={`py-3 w-full rounded-xl font-sans font-bold text-xs tracking-widest transition-all duration-200 cursor-pointer uppercase ${
                        isActive 
                          ? 'bg-[#3533CD]/10 text-[#3533CD] border border-[#3533CD]/20' 
                          : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="h-px w-full bg-[#1A1A1A]" />

              <a
                href={`https://wa.me/${footerInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                id="mobile-drawer-whatsapp-btn"
                className="w-full flex items-center justify-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-3.5 px-5 rounded-full transition-all duration-200 cursor-pointer uppercase tracking-wider shadow-lg shadow-[#3533CD]/20"
              >
                <MessageCircle size={16} />
                <span>Falar com Especialista</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
