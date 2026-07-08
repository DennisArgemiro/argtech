import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS_DATA } from '../data';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#111111]">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#3533CD]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-widest uppercase text-[#3533CD] font-bold">
            Dúvidas Frequentes
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
            Perguntas Comuns
          </h2>
          <p className="font-sans text-[#A8A8A8] text-base max-w-xl mx-auto font-light leading-relaxed">
            Respondemos de forma direta às principais perguntas que recebemos dos nossos clientes.
          </p>
        </div>

        {/* Collapsible Accordion List */}
        <div className="space-y-4">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#111111] border border-[#252525] transition-all duration-300 overflow-hidden"
                style={{
                  borderRadius: '18px',
                }}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="text-[#3533CD] shrink-0" size={18} />
                    <span className="font-sans text-sm sm:text-base font-bold text-white group-hover:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-1 bg-[#181818] border border-[#252525] text-[#A8A8A8] rounded-lg"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-0 text-left border-t border-[#252525]/40">
                        <p className="font-sans text-xs sm:text-sm text-[#A8A8A8] leading-relaxed font-light">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
