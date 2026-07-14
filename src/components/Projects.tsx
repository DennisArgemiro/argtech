import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  images: string[];
  visit_url: string;
  order_index: number;
  visible: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('visible', '==', true)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      data.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center">
            <p className="text-[#A8A8A8]">Carregando projetos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#3533CD]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-left mb-16">
          <span className="text-xs font-bold tracking-widest text-[#3533CD] uppercase mb-3 block">
            NOSSOS PROJETOS
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-none">
            Portfólio de Soluções
          </h2>
          <p className="font-sans text-[#A8A8A8] text-xs sm:text-sm mt-4 max-w-xl">
            Conheça alguns dos projetos que desenvolvemos para nossos clientes.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={idx} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectCard({ project, index, onClick }: any) {
  const coverImage = project.cover_image || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group bg-[#0A0A0A] border border-white/5 hover:border-[#3533CD]/40 rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Cover Image */}
      {coverImage ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-[#3533CD] text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
              Ver Detalhes
            </span>
          </div>
        </div>
      ) : (
        <div className="aspect-[16/10] bg-[#111] flex items-center justify-center">
          <span className="text-[#A8A8A8] text-xs">Sem imagem</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider mb-1 group-hover:text-[#3533CD] transition-colors">
          {project.title}
        </h3>
        
        {project.subtitle && (
          <p className="font-sans text-[#3533CD] text-xs mb-2">
            {project.subtitle}
          </p>
        )}
        
        <p className="font-sans text-[#A8A8A8] text-xs leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = project.images && project.images.length > 0 ? project.images : [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl z-10 rounded-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Carousel - Left Side */}
          {images.length > 0 ? (
            <div className="lg:w-3/5 relative bg-[#111] flex items-center justify-center min-h-[300px]">
              <div className="relative">
                <img
                  src={images[currentImage]}
                  alt={project.title}
                  className="max-w-full max-h-[70vh] object-contain"
                />
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Dots indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_: string, i: number) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        i === currentImage ? 'bg-[#3533CD] w-5' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="lg:w-3/5 bg-[#111] flex items-center justify-center min-h-[300px]">
              <span className="text-[#A8A8A8]">Sem imagem</span>
            </div>
          )}

          {/* Content - Right Side */}
          <div className="lg:w-2/5 p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-sans text-2xl font-extrabold text-white uppercase tracking-tight mb-2">
                {project.title}
              </h2>

              {project.subtitle && (
                <p className="font-sans text-[#3533CD] text-sm mb-4">
                  {project.subtitle}
                </p>
              )}
              
              <p className="font-sans text-[#A8A8A8] text-sm leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Visit Button */}
            {project.visit_url && (
              <a
                href={project.visit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-3 px-6 rounded-md transition-all duration-300 uppercase tracking-wider mt-8"
              >
                <span>Visitar Projeto</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
