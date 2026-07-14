import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, AlertCircle, X } from 'lucide-react';
import type { ContactFormData } from '../types';
import { useFooterInfo } from '../hooks/useFooterInfo';

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  honeypot?: string;
  [key: string]: string | undefined;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()\-+]{10,}$/;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_FIELD_LENGTH = 200;

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const validateField = (name: string, value: string): string | undefined => {
  const sanitized = sanitizeInput(value);

  switch (name) {
    case 'name':
      if (!sanitized) {return 'Nome é obrigatório';}
      if (sanitized.length < 2) {return 'Nome deve ter pelo menos 2 caracteres';}
      if (sanitized.length > MAX_FIELD_LENGTH) {return `Nome deve ter no máximo ${MAX_FIELD_LENGTH} caracteres`;}
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(sanitized)) {return 'Nome deve conter apenas letras e espaços';}
      break;

    case 'email':
      if (!sanitized) {return 'E-mail é obrigatório';}
      if (!EMAIL_REGEX.test(sanitized)) {return 'E-mail inválido';}
      if (sanitized.length > MAX_FIELD_LENGTH) {return `E-mail deve ter no máximo ${MAX_FIELD_LENGTH} caracteres`;}
      break;

    case 'phone':
      if (!sanitized) {return 'Telefone é obrigatório';}
      if (!PHONE_REGEX.test(sanitized.replace(/\s/g, ''))) {return 'Telefone inválido (mín. 10 dígitos)';}
      break;

    case 'company':
      if (!sanitized) {return 'Nome da empresa é obrigatório';}
      if (sanitized.length < 2) {return 'Nome da empresa deve ter pelo menos 2 caracteres';}
      if (sanitized.length > MAX_FIELD_LENGTH) {return `Nome da empresa deve ter no máximo ${MAX_FIELD_LENGTH} caracteres`;}
      break;

    case 'service':
      if (!sanitized) {return 'Selecione um serviço';}
      break;

    case 'message':
      if (!sanitized) {return 'Mensagem é obrigatória';}
      if (sanitized.length < 10) {return 'Mensagem deve ter pelo menos 10 caracteres';}
      if (sanitized.length > MAX_MESSAGE_LENGTH) {return `Mensagem deve ter no máximo ${MAX_MESSAGE_LENGTH} caracteres`;}
      break;
  }
  return undefined;
};

export default function ContactForm() {
  const { footerInfo } = useFooterInfo();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'outro',
    message: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const validatableKeys: Array<keyof ContactFormData> = ['name', 'email', 'phone', 'company', 'service', 'message'];
    
    validatableKeys.forEach((key) => {
      const value = formData[key];
      if (value !== undefined) {
        const error = validateField(key, String(value));
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Only process known fields
    const validatableKeys: Array<keyof ContactFormData> = ['name', 'email', 'phone', 'company', 'service', 'message'];
    if (!validatableKeys.includes(name as keyof ContactFormData)) {return;}
    
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitized }));

    if (touched[name]) {
      const error = validateField(name, sanitized);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const validatableKeys: Array<keyof ContactFormData> = ['name', 'email', 'phone', 'company', 'service', 'message'];
    if (!validatableKeys.includes(name as keyof ContactFormData)) {return;}
    
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {return;}

    if (honeypot) {
      setSubmitError('');
      setShowSuccessModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
      }

      setIsSubmitting(false);
      setShowSuccessModal(true);
    } catch {
      setIsSubmitting(false);
      setSubmitError('Erro ao enviar. Tente novamente ou entre em contato direto.');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: 'outro',
      message: '',
    });
    setTouched({});
    setErrors({});
  };

  const hasError = (name: string) => touched[name] && errors[name];

  return (
    <section id="contact" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3533CD]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-left mb-16">
          <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-3 block">
            VAMOS CONVERSAR?
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-none">
            Contato & atendimento
          </h2>
          <p className="font-sans text-[#A8A8A8] text-xs sm:text-sm mt-4 max-w-xl">
            Pronto para transformar sua empresa? Fale conosco e impulsione seu negócio hoje. Preencha o formulário e retornaremos em menos de 1 hora comercial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-6 text-left font-sans">
            <div 
              className="bg-[#0A0A0A] border border-white/5 p-6 rounded-md"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
            >
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white mb-6">Informações Corporativas</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#3533CD]/10 text-[#3533CD] rounded-md shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#A8A8A8] uppercase tracking-wider block font-bold">Central de Atendimento</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white">{footerInfo.phone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#3533CD]/10 text-[#3533CD] rounded-md shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#A8A8A8] uppercase tracking-wider block font-bold">E-mail Comercial</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white">{footerInfo.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#3533CD]/10 text-[#3533CD] rounded-md shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#A8A8A8] uppercase tracking-wider block font-bold">Sede Corporativa</span>
                    <span className="font-sans text-xs leading-relaxed text-white">{footerInfo.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-[#3533CD]/5 border border-[#3533CD]/15 p-5 flex items-start gap-3 rounded-md"
            >
              <ShieldCheck className="text-[#3533CD] shrink-0" size={18} />
              <div>
                <h4 className="font-sans text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                  LGPD & Segurança
                </h4>
                <p className="font-sans text-[11px] text-[#A8A8A8] leading-normal font-light">
                  Seus dados estão protegidos por criptografia de ponta a ponta e nunca serão compartilhados com terceiros.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <form 
              onSubmit={handleSubmit}
              className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-8 space-y-6 text-left rounded-md"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
              noValidate
            >
              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-xs" role="alert">
                  <AlertCircle size={14} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-sans text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">
                    Seu Nome *
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-[#111] border px-4 py-3 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#3533CD] focus:ring-1 focus:ring-[#3533CD] transition-all ${
                        hasError('name') ? 'border-red-500' : 'border-white/5'
                      }`}
                      placeholder="João Silva"
                      autoComplete="name"
                      maxLength={MAX_FIELD_LENGTH}
                    />
                    {hasError('name') && (
                      <span className="absolute -bottom-5 left-0 text-red-400 text-[9px] font-medium">{errors.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-sans text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">
                    E-mail Corporativo *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-[#111] border px-4 py-3 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#3533CD] focus:ring-1 focus:ring-[#3533CD] transition-all ${
                        hasError('email') ? 'border-red-500' : 'border-white/5'
                      }`}
                      placeholder="joao@suaempresa.com"
                      autoComplete="email"
                      maxLength={MAX_FIELD_LENGTH}
                    />
                    {hasError('email') && (
                      <span className="absolute -bottom-5 left-0 text-red-400 text-[9px] font-medium">{errors.email}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="font-sans text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-[#111] border px-4 py-3 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#3533CD] focus:ring-1 focus:ring-[#3533CD] transition-all ${
                        hasError('phone') ? 'border-red-500' : 'border-white/5'
                      }`}
                      placeholder="(XX) XXXX-XXXX"
                      autoComplete="tel"
                      maxLength={20}
                    />
                    {hasError('phone') && (
                      <span className="absolute -bottom-5 left-0 text-red-400 text-[9px] font-medium">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="font-sans text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">
                    Nome da Empresa *
                  </label>
                  <div className="relative">
                    <input
                      id="company"
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-[#111] border px-4 py-3 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#3533CD] focus:ring-1 focus:ring-[#3533CD] transition-all ${
                        hasError('company') ? 'border-red-500' : 'border-white/5'
                      }`}
                      placeholder="Minha Empresa S/A"
                      autoComplete="organization"
                      maxLength={MAX_FIELD_LENGTH}
                    />
                    {hasError('company') && (
                      <span className="absolute -bottom-5 left-0 text-red-400 text-[9px] font-medium">{errors.company}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service" className="font-sans text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">
                  Serviço de Interesse *
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`bg-[#111] border px-4 py-3.5 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#3533CD] focus:ring-1 focus:ring-[#3533CD] transition-all cursor-pointer ${
                      hasError('service') ? 'border-red-500' : 'border-white/5'
                    }`}
                  >
                    <option value="automacao">Automação Comercial</option>
                    <option value="software">Desenvolvimento de Software</option>
                    <option value="integracao">Integração de Sistemas</option>
                    <option value="infraestrutura">Instalação e Manutenção</option>
                    <option value="outro">Outros Assuntos</option>
                  </select>
                  {hasError('service') && (
                    <span className="absolute -bottom-5 left-0 text-red-400 text-[9px] font-medium">{errors.service}</span>
                  )}
                </div>
              </div>

              <div aria-hidden="true" className="absolute opacity-0 h-0 overflow-hidden" style={{ position: 'absolute', left: '-9999px' }}>
                <label htmlFor="honeypot">Não preencher</label>
                <input
                  id="honeypot"
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-sans text-[10px] font-semibold text-[#A8A8A8] uppercase tracking-wider">
                  Como podemos ajudar? *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`bg-[#111] border px-4 py-3 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#3533CD] focus:ring-1 focus:ring-[#3533CD] transition-all resize-none leading-relaxed ${
                      hasError('message') ? 'border-red-500' : 'border-white/5'
                    }`}
                    placeholder="Fale brevemente sobre as necessidades de TI, automação ou sistemas da sua empresa..."
                    maxLength={MAX_MESSAGE_LENGTH}
                  />
                  {hasError('message') && (
                    <span className="absolute -bottom-5 left-0 text-red-400 text-[9px] font-medium">{errors.message}</span>
                  )}
                  <p className="text-right text-[10px] text-[#A8A8A8] mt-1">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-4 rounded-md transition-all duration-300 shadow-md uppercase tracking-wider cursor-pointer ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Enviando dados...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Falar com um Especialista</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/5 p-8 text-center shadow-2xl z-10 rounded-md"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1 text-[#A8A8A8] hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>

              <div className="flex justify-center mb-6">
                <div className="p-3 bg-[#3533CD]/10 text-[#3533CD] rounded-full border border-[#3533CD]/20">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
              </div>

              <h4 className="font-sans text-xl font-black text-white mb-2 uppercase tracking-tight">
                Contato Enviado!
              </h4>
              <p className="font-sans text-[10px] text-[#A8A8A8] uppercase tracking-wider font-bold mb-4 text-[#3533CD]">
                Argtech Soluções em Informática
              </p>

              <p className="font-sans text-xs sm:text-sm text-[#A8A8A8] leading-relaxed font-light mb-6">
                Agradecemos o contato, <strong>{formData.name}</strong>. Nosso especialista de atendimento foi notificado sobre a sua solicitação para a empresa <strong>{formData.company}</strong> e entrará em contato via e-mail ou WhatsApp em alguns minutos.
              </p>

              <button
                onClick={handleCloseModal}
                className="w-full bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-3.5 rounded-md transition-all duration-200 cursor-pointer text-center uppercase tracking-wider"
              >
                Entendido, obrigado!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}