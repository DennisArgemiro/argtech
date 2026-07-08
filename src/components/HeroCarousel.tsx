import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

import heroBanner from '../assets/images/argtech_hero_banner_1783306907106.jpg';
import automacaoImg from '../assets/images/argtech_service_automacao_1783306920813.jpg';
import desenvolvimentoImg from '../assets/images/argtech_service_desenvolvimento_1783306934046.jpg';
import infraestruturaImg from '../assets/images/argtech_service_infraestrutura_1783306958338.jpg';
import integracaoImg from '../assets/images/argtech_service_integracao_1783306946553.jpg';

const defaultSlides = [
  { id: '1', image: heroBanner, title: 'Soluções que Conectam', subtitle: 'Tecnologia que Impulsiona' },
  { id: '2', image: automacaoImg, title: 'Automação Comercial', subtitle: 'Otimize sua gestão' },
  { id: '3', image: desenvolvimentoImg, title: 'Desenvolvimento', subtitle: 'Sistemas personalizados' },
  { id: '4', image: infraestruturaImg, title: 'Infraestrutura', subtitle: 'Suporte completo' },
  { id: '5', image: integracaoImg, title: 'Integração', subtitle: 'Sistemas conectados' },
];

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  order_index: number;
  visible: boolean;
}

interface HeroCarouselProps {
  onNavigate: (sectionId: string) => void;
}

export default function HeroCarousel({ onNavigate: _onNavigate }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarouselSlides();
  }, []);

  const loadCarouselSlides = async () => {
    try {
      const carouselQuery = query(collection(db, 'carousel_slides'), orderBy('order_index'));
      const carouselSnapshot = await getDocs(carouselQuery);
      
      if (carouselSnapshot.docs.length > 0) {
        const carouselData = carouselSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as CarouselSlide[];
        
        // Filter only visible slides and those with images
        const validSlides = carouselData.filter(slide => slide.visible && slide.image);
        
        if (validSlides.length > 0) {
          setSlides(validSlides);
        }
      }
    } catch (error) {
      console.error('Error loading carousel slides:', error);
      // Keep default slides on error
    }
    setLoading(false);
  };

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Reset current slide if it exceeds the slides length
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  if (loading || slides.length === 0) {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-pulse text-[#A8A8A8] text-sm">Carregando...</div>
      </div>
    );
  }

  const currentSlide = slides[current];

  if (!currentSlide) {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#A8A8A8] text-sm">Nenhum slide disponível</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-1">
              {currentSlide.title}
            </h3>
            <p className="font-sans text-sm text-white/70">
              {currentSlide.subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              i === current ? 'bg-[#3533CD] w-4' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
