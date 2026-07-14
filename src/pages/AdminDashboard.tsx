import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  LogOut, Save, Plus, Trash2, Upload, FolderOpen, X,
  Home, Briefcase, CheckCircle, Phone, Layout, GalleryHorizontal
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { 
  collection, getDocs, updateDoc, doc, query, orderBy, addDoc, deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import ArgtechLogo from '../components/ArgtechLogo';

const sanitize = (value: string): string => value.replace(/[<>]/g, '').trim();

const isValidURL = (url: string): boolean => {
  if (!url || url.trim() === '') return true;
  return /^https?:\/\/.+\..+/i.test(url.trim()) || url.startsWith('data:image/');
};

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'dashboard' | 'hero' | 'carousel' | 'services' | 'benefits' | 'contact' | 'projects' | 'footer';

interface SiteText {
  id: string;
  section: string;
  key: string;
  value: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  long_description: string;
  icon: string;
  image_url: string;
  order_index: number;
  visible: boolean;
}

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

interface FooterInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
}

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  order_index: number;
  visible: boolean;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroTexts, setHeroTexts] = useState<SiteText[]>([]);
  const [servicesTexts, setServicesTexts] = useState<SiteText[]>([]);
  const [benefitsTexts, setBenefitsTexts] = useState<SiteText[]>([]);
  const [contactTexts, setContactTexts] = useState<SiteText[]>([]);
  const [footerTexts, setFooterTexts] = useState<SiteText[]>([]);
  
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [footerInfo, setFooterInfo] = useState<FooterInfo>({
    id: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
    linkedin: ''
  });
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Load all texts and group by section
      const textsSnapshot = await getDocs(collection(db, 'site_texts'));
      const allTexts = textsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SiteText[];
      
      setHeroTexts(allTexts.filter(t => t.section === 'hero'));
      setServicesTexts(allTexts.filter(t => t.section === 'services'));
      setBenefitsTexts(allTexts.filter(t => t.section === 'benefits'));
      setContactTexts(allTexts.filter(t => t.section === 'contact'));
      setFooterTexts(allTexts.filter(t => t.section === 'footer'));

      // Load services
      const servicesQuery = query(collection(db, 'services'), orderBy('order_index'));
      const servicesSnapshot = await getDocs(servicesQuery);
      const servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(servicesData);

      // Load projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      console.log('[Admin] Projects snapshot:', projectsSnapshot.size, 'docs');
      const projectsData = projectsSnapshot.docs.map(doc => {
        console.log('[Admin] Project doc:', doc.id, doc.data());
        return {
          id: doc.id,
          ...doc.data()
        };
      }) as Project[];
      projectsData.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      setProjects(projectsData);

      // Load footer info
      const footerSnapshot = await getDocs(collection(db, 'footer_info'));
      const footerDoc = footerSnapshot.docs[0];
      if (footerDoc) {
        setFooterInfo({
          id: footerDoc.id,
          ...footerDoc.data()
        } as FooterInfo);
      }

      // Load carousel slides
      const carouselQuery = query(collection(db, 'carousel_slides'), orderBy('order_index'));
      const carouselSnapshot = await getDocs(carouselQuery);
      const carouselData = carouselSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CarouselSlide[];
      setCarouselSlides(carouselData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    
    setLoading(false);
  };

  const handleSaveTexts = async (textsToSave: SiteText[]) => {
    setSaving(true);
    try {
      for (const text of textsToSave) {
        const textRef = doc(db, 'site_texts', text.id);
        await updateDoc(textRef, { value: sanitize(text.value ?? '') });
      }
      alert('Textos salvos com sucesso!');
    } catch (error) {
      console.error('Error saving texts:', error);
      alert('Erro ao salvar textos');
    }
    setSaving(false);
  };

  const handleSaveServices = async () => {
    setSaving(true);
    try {
      for (const service of services) {
        const serviceRef = doc(db, 'services', service.id);
        await updateDoc(serviceRef, {
          title: sanitize(service.title ?? ''),
          description: sanitize(service.description ?? ''),
          long_description: sanitize(service.long_description ?? ''),
          icon: sanitize(service.icon ?? ''),
          image_url: service.image_url ?? '',
          order_index: service.order_index ?? 0,
          visible: service.visible ?? true
        });
      }
      alert('Serviços salvos com sucesso!');
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Erro ao salvar serviços');
    }
    setSaving(false);
  };

  const handleSaveProjects = async () => {
    setSaving(true);
    try {
      for (const project of projects) {
        if (!isValidURL(project.visit_url)) {
          alert(`URL inválida no projeto "${project.title}": ${project.visit_url}`);
          setSaving(false);
          return;
        }
        const projectRef = doc(db, 'projects', project.id);
        await updateDoc(projectRef, {
          title: sanitize(project.title ?? ''),
          subtitle: sanitize(project.subtitle ?? ''),
          description: sanitize(project.description ?? ''),
          cover_image: project.cover_image ?? '',
          images: project.images ?? [],
          visit_url: project.visit_url ?? '',
          order_index: project.order_index ?? 0,
          visible: project.visible ?? true
        });
      }
      alert('Projetos salvos com sucesso!');
    } catch (error) {
      console.error('Error saving projects:', error);
      alert('Erro ao salvar projetos');
    }
    setSaving(false);
  };

  const handleSaveFooter = async () => {
    setSaving(true);
    try {
      const data = {
        phone: footerInfo.phone ?? '',
        email: footerInfo.email ?? '',
        address: footerInfo.address ?? '',
        whatsapp: footerInfo.whatsapp ?? '',
        instagram: footerInfo.instagram ?? '',
        linkedin: footerInfo.linkedin ?? ''
      };
      if (footerInfo.id) {
        const footerRef = doc(db, 'footer_info', footerInfo.id);
        await updateDoc(footerRef, data);
      } else {
        const docRef = await addDoc(collection(db, 'footer_info'), data);
        setFooterInfo({ ...footerInfo, id: docRef.id });
      }
      alert('Rodapé salvo com sucesso!');
    } catch (error) {
      console.error('Error saving footer:', error);
      alert('Erro ao salvar rodapé');
    }
    setSaving(false);
  };

  const handleSaveCarousel = async () => {
    setSaving(true);
    try {
      for (const slide of carouselSlides) {
        const slideRef = doc(db, 'carousel_slides', slide.id);
        await updateDoc(slideRef, {
          image: slide.image ?? '',
          title: sanitize(slide.title ?? ''),
          subtitle: sanitize(slide.subtitle ?? ''),
          order_index: slide.order_index ?? 0,
          visible: slide.visible ?? true
        });
      }
      alert('Carrossel salvo com sucesso!');
    } catch (error) {
      console.error('Error saving carousel:', error);
      alert('Erro ao salvar carrossel');
    }
    setSaving(false);
  };

  const handleAddCarouselSlide = async () => {
    try {
      const newSlide = {
        image: '',
        title: 'Novo Slide',
        subtitle: 'Descrição do slide',
        order_index: carouselSlides.length + 1,
        visible: true
      };
      const docRef = await addDoc(collection(db, 'carousel_slides'), newSlide);
      setCarouselSlides([...carouselSlides, { ...newSlide, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding carousel slide:', error);
    }
  };

  const handleDeleteCarouselSlide = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'carousel_slides', id));
      setCarouselSlides(carouselSlides.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting carousel slide:', error);
    }
  };

  const handleAddProject = async () => {
    try {
      const newProject = {
        title: 'Novo Projeto',
        subtitle: '',
        description: 'Descrição do projeto...',
        cover_image: '',
        images: [],
        visit_url: '',
        order_index: projects.length + 1,
        visible: true
      };
      const docRef = await addDoc(collection(db, 'projects'), newProject);
      setProjects([...projects, { ...newProject, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error(`Arquivo muito grande (máx ${MAX_FILE_SIZE / 1024 / 1024}MB)`));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        const timeoutId = setTimeout(() => {
          img.src = '';
          reject(new Error('Timeout ao processar imagem'));
        }, 15000);
        img.onload = () => {
          clearTimeout(timeoutId);
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Erro ao carregar imagem'));
        };
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero' as Tab, label: 'Início', icon: Home },
    { id: 'carousel' as Tab, label: 'Carrossel', icon: GalleryHorizontal },
    { id: 'services' as Tab, label: 'Serviços', icon: Briefcase },
    { id: 'benefits' as Tab, label: 'Benefícios', icon: CheckCircle },
    { id: 'contact' as Tab, label: 'Contato', icon: Phone },
    { id: 'projects' as Tab, label: 'Projetos', icon: FolderOpen },
    { id: 'footer' as Tab, label: 'Rodapé', icon: Layout },
  ];

  const renderTextField = (text: SiteText, onChange: (value: string) => void) => (
    <div key={text.id} className="flex flex-col gap-2">
      <label className="text-xs text-[#A8A8A8] font-medium">{text.key}</label>
      <input
        type="text"
        value={text.value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
      />
    </div>
  );

  const renderTextArea = (text: SiteText, onChange: (value: string) => void) => (
    <div key={text.id} className="flex flex-col gap-2">
      <label className="text-xs text-[#A8A8A8] font-medium">{text.key}</label>
      <textarea
        value={text.value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors resize-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <ArgtechLogo size={40} />
          <p className="text-xs text-[#A8A8A8] mt-2">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-sans transition-colors mb-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#3533CD]/10 text-[#3533CD]'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-sans text-[#A8A8A8] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#A8A8A8]">Carregando...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-2xl font-bold text-white">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                    <p className="text-[#A8A8A8] text-sm">Serviços</p>
                    <p className="text-3xl font-bold text-white mt-2">{services.length}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                    <p className="text-[#A8A8A8] text-sm">Projetos</p>
                    <p className="text-3xl font-bold text-white mt-2">{projects.length}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                    <p className="text-[#A8A8A8] text-sm">Textos Hero</p>
                    <p className="text-3xl font-bold text-white mt-2">{heroTexts.length}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                    <p className="text-[#A8A8A8] text-sm">Textos Benefícios</p>
                    <p className="text-3xl font-bold text-white mt-2">{benefitsTexts.length}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Hero Section Tab */}
            {activeTab === 'hero' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Seção Início (Hero)</h2>
                  <button
                    onClick={() => handleSaveTexts(heroTexts)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Textos</h3>
                  {heroTexts.map((text) => (
                    <div key={text.id}>
                      {text.value.length > 50 ? (
                        renderTextArea(text, (value) => {
                          setHeroTexts(heroTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      ) : (
                        renderTextField(text, (value) => {
                          setHeroTexts(heroTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Carousel Tab */}
            {activeTab === 'carousel' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Carrossel do Início</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCarouselSlide}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      Novo Slide
                    </button>
                    <button
                      onClick={handleSaveCarousel}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Save size={14} />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {carouselSlides.map((slide) => (
                    <div key={slide.id} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            setCarouselSlides(carouselSlides.map(s => 
                              s.id === slide.id ? { ...s, title: e.target.value } : s
                            ));
                          }}
                          className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm font-bold focus:outline-none focus:border-[#3533CD] transition-colors w-64"
                          placeholder="Título do slide"
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-[#A8A8A8]">Ordem:</label>
                            <input
                              type="number"
                              value={slide.order_index}
                              onChange={(e) => {
                                setCarouselSlides(carouselSlides.map(s => 
                                  s.id === slide.id ? { ...s, order_index: parseInt(e.target.value) || 0 } : s
                                ));
                              }}
                              className="w-16 bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                            />
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slide.visible}
                              onChange={(e) => {
                                setCarouselSlides(carouselSlides.map(s => 
                                  s.id === slide.id ? { ...s, visible: e.target.checked } : s
                                ));
                              }}
                              className="w-4 h-4 accent-[#3533CD]"
                            />
                            <span className="text-xs text-[#A8A8A8]">Visível</span>
                          </label>
                          <button
                            onClick={() => handleDeleteCarouselSlide(slide.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          setCarouselSlides(carouselSlides.map(s => 
                            s.id === slide.id ? { ...s, subtitle: e.target.value } : s
                          ));
                        }}
                        className="w-full bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors mb-4"
                        placeholder="Subtítulo do slide"
                      />

                      <div>
                        <label className="block text-xs text-[#A8A8A8] mb-2">Imagem do Slide</label>
                        {slide.image && (
                          <div className="relative inline-block mb-2">
                            <img src={slide.image} alt="" className="w-40 h-24 object-cover rounded-md border border-white/10" />
                            <button
                              onClick={() => {
                                setCarouselSlides(carouselSlides.map(s => 
                                  s.id === slide.id ? { ...s, image: '' } : s
                                ));
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                            >
                              <X size={10} className="text-white" />
                            </button>
                          </div>
                        )}
                        <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-3 rounded-md transition-colors cursor-pointer w-fit">
                          <Upload size={14} />
                          <span>{slide.image ? 'Trocar Imagem' : 'Adicionar Imagem'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) {return;}
                              const base64 = await convertToBase64(file);
                              setCarouselSlides(carouselSlides.map(s => 
                                s.id === slide.id ? { ...s, image: base64 } : s
                              ));
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  {carouselSlides.length === 0 && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-8 text-center">
                      <GalleryHorizontal size={32} className="text-[#A8A8A8] mx-auto mb-3" />
                      <p className="text-sm text-[#A8A8A8]">Nenhum slide cadastrado</p>
                      <p className="text-xs text-[#A8A8A8] mt-1">Clique em "Novo Slide" para adicionar</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Services Section Tab */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Seção Serviços</h2>
                  <button
                    onClick={handleSaveServices}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                {/* Services Texts */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Textos da Seção</h3>
                  {servicesTexts.map((text) => (
                    <div key={text.id}>
                      {text.value.length > 50 ? (
                        renderTextArea(text, (value) => {
                          setServicesTexts(servicesTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      ) : (
                        renderTextField(text, (value) => {
                          setServicesTexts(servicesTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleSaveTexts(servicesTexts)}
                    disabled={saving}
                    className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-4 rounded-md transition-colors cursor-pointer"
                  >
                    <Save size={14} />
                    Salvar Textos
                  </button>
                </div>

                {/* Individual Services */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Serviços Individuais</h3>
                  {services.map((service) => (
                    <div key={service.id} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-sans text-lg font-bold text-white">{service.title}</h4>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={service.visible}
                            onChange={(e) => {
                              setServices(services.map(s => 
                                s.id === service.id ? { ...s, visible: e.target.checked } : s
                              ));
                            }}
                            className="w-4 h-4 accent-[#3533CD]"
                          />
                          <span className="text-xs text-[#A8A8A8]">Visível</span>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-[#A8A8A8]">Título</label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                setServices(services.map(s => 
                                  s.id === service.id ? { ...s, title: e.target.value } : s
                                ));
                              }}
                              className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-[#A8A8A8]">Descrição Curta</label>
                            <textarea
                              value={service.description}
                              onChange={(e) => {
                                setServices(services.map(s => 
                                  s.id === service.id ? { ...s, description: e.target.value } : s
                                ));
                              }}
                              rows={2}
                              className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors resize-none"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-[#A8A8A8]">Descrição Longa</label>
                            <textarea
                              value={service.long_description}
                              onChange={(e) => {
                                setServices(services.map(s => 
                                  s.id === service.id ? { ...s, long_description: e.target.value } : s
                                ));
                              }}
                              rows={4}
                              className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors resize-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-[#A8A8A8]">Ícone</label>
                            <input
                              type="text"
                              value={service.icon}
                              onChange={(e) => {
                                setServices(services.map(s => 
                                  s.id === service.id ? { ...s, icon: e.target.value } : s
                                ));
                              }}
                              className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                              placeholder="ShoppingCart, Code2, etc."
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-[#A8A8A8]">Imagem</label>
                            {service.image_url && (
                              <div className="relative inline-block mb-2">
                                <img src={service.image_url} alt="" className="w-32 h-20 object-cover rounded-md border border-white/10" />
                                <button
                                  onClick={() => {
                                    setServices(services.map(s => 
                                      s.id === service.id ? { ...s, image_url: '' } : s
                                    ));
                                  }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                                >
                                  <X size={10} className="text-white" />
                                </button>
                              </div>
                            )}
                            <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-3 rounded-md transition-colors cursor-pointer w-fit">
                              <Upload size={14} />
                              <span>{service.image_url ? 'Trocar Imagem' : 'Adicionar Imagem'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) {return;}
                                  const base64 = await convertToBase64(file);
                                  setServices(services.map(s => 
                                    s.id === service.id ? { ...s, image_url: base64 } : s
                                  ));
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Benefits Section Tab */}
            {activeTab === 'benefits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Seção Benefícios</h2>
                  <button
                    onClick={() => handleSaveTexts(benefitsTexts)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Textos</h3>
                  {benefitsTexts.map((text) => (
                    <div key={text.id}>
                      {text.value.length > 50 ? (
                        renderTextArea(text, (value) => {
                          setBenefitsTexts(benefitsTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      ) : (
                        renderTextField(text, (value) => {
                          setBenefitsTexts(benefitsTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Section Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Seção Contato</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveFooter}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Save size={14} />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => handleSaveTexts(contactTexts)}
                      disabled={saving}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-4 rounded-md transition-colors cursor-pointer"
                    >
                      <Save size={14} />
                      Salvar Textos
                    </button>
                  </div>
                </div>

                {/* Contact Info Form */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Informações de Contato</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#A8A8A8]">Telefone</label>
                      <input
                        type="text"
                        value={footerInfo.phone}
                        onChange={(e) => setFooterInfo({ ...footerInfo, phone: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                        placeholder="(XX) XXXX-XXXX"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#A8A8A8]">E-mail</label>
                      <input
                        type="email"
                        value={footerInfo.email}
                        onChange={(e) => setFooterInfo({ ...footerInfo, email: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                        placeholder="contato@argtech.com.br"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#A8A8A8]">Endereço</label>
                      <input
                        type="text"
                        value={footerInfo.address}
                        onChange={(e) => setFooterInfo({ ...footerInfo, address: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                        placeholder="Sua cidade/UF"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#A8A8A8]">WhatsApp</label>
                      <input
                        type="text"
                        value={footerInfo.whatsapp}
                        onChange={(e) => setFooterInfo({ ...footerInfo, whatsapp: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                        placeholder="5521987654321"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#A8A8A8]">Instagram</label>
                      <input
                        type="text"
                        value={footerInfo.instagram}
                        onChange={(e) => setFooterInfo({ ...footerInfo, instagram: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                        placeholder="https://instagram.com/argtech"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#A8A8A8]">LinkedIn</label>
                      <input
                        type="text"
                        value={footerInfo.linkedin}
                        onChange={(e) => setFooterInfo({ ...footerInfo, linkedin: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                        placeholder="https://linkedin.com/company/argtech"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Texts */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Textos da Seção</h3>
                  {contactTexts.map((text) => (
                    <div key={text.id}>
                      {text.value.length > 50 ? (
                        renderTextArea(text, (value) => {
                          setContactTexts(contactTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      ) : (
                        renderTextField(text, (value) => {
                          setContactTexts(contactTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Projetos</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddProject}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      Novo Projeto
                    </button>
                    <button
                      onClick={handleSaveProjects}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Save size={14} />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            setProjects(projects.map(p => 
                              p.id === project.id ? { ...p, title: e.target.value } : p
                            ));
                          }}
                          className="bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm font-bold focus:outline-none focus:border-[#3533CD] transition-colors w-64"
                          placeholder="Título do projeto"
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={project.visible}
                              onChange={(e) => {
                                setProjects(projects.map(p => 
                                  p.id === project.id ? { ...p, visible: e.target.checked } : p
                                ));
                              }}
                              className="w-4 h-4 accent-[#3533CD]"
                            />
                            <span className="text-xs text-[#A8A8A8]">Visível</span>
                          </label>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={project.subtitle}
                        onChange={(e) => {
                          setProjects(projects.map(p => 
                            p.id === project.id ? { ...p, subtitle: e.target.value } : p
                          ));
                        }}
                        className="w-full bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors mb-4"
                        placeholder="Subtítulo (opcional)"
                      />

                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          setProjects(projects.map(p => 
                            p.id === project.id ? { ...p, description: e.target.value } : p
                          ));
                        }}
                        rows={4}
                        className="w-full bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors resize-none mb-4"
                        placeholder="Descrição do projeto..."
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-[#A8A8A8] mb-2">URL para Visitar</label>
                          <input
                            type="url"
                            value={project.visit_url}
                            onChange={(e) => {
                              setProjects(projects.map(p => 
                                p.id === project.id ? { ...p, visit_url: e.target.value } : p
                              ));
                            }}
                            className="w-full bg-[#111] border border-white/10 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors"
                            placeholder="https://exemplo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A8A8] mb-2">Imagem de Capa</label>
                          {project.cover_image && (
                            <div className="relative inline-block mb-2">
                              <img src={project.cover_image} alt="" className="w-20 h-14 object-cover rounded-md border border-white/10" />
                              <button
                                onClick={() => {
                                  setProjects(projects.map(p => 
                                    p.id === project.id ? { ...p, cover_image: '' } : p
                                  ));
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                              >
                                <X size={10} className="text-white" />
                              </button>
                            </div>
                          )}
                          <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-3 rounded-md transition-colors cursor-pointer w-fit">
                            <Upload size={14} />
                            <span>{project.cover_image ? 'Trocar Capa' : 'Adicionar Capa'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) {return;}
                                const base64 = await convertToBase64(file);
                                setProjects(projects.map(p => 
                                  p.id === project.id ? { ...p, cover_image: base64 } : p
                                ));
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A8A8A8] mb-2">Imagens do Carousel</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="relative group">
                              <img src={img} alt="" className="w-16 h-16 object-cover rounded-md border border-white/10" />
                              <button
                                onClick={() => {
                                  const newImages = project.images.filter((_: string, i: number) => i !== imgIdx);
                                  setProjects(projects.map(p => 
                                    p.id === project.id ? { ...p, images: newImages } : p
                                  ));
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X size={10} className="text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-3 rounded-md transition-colors cursor-pointer w-fit">
                          <Upload size={14} />
                          <span>Adicionar Imagem</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files) {return;}
                              
                              const newImages = [...project.images];
                              const filesArray = Array.from(files) as File[];
                              for (const file of filesArray) {
                                const base64 = await convertToBase64(file);
                                newImages.push(base64);
                              }
                              
                              setProjects(projects.map(p => 
                                p.id === project.id ? { ...p, images: newImages } : p
                              ));
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-8 text-center">
                      <FolderOpen size={32} className="text-[#A8A8A8] mx-auto mb-3" />
                      <p className="text-sm text-[#A8A8A8]">Nenhum projeto cadastrado</p>
                      <p className="text-xs text-[#A8A8A8] mt-1">Clique em "Novo Projeto" para adicionar</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold text-white">Seção Rodapé</h2>
                  <button
                    onClick={handleSaveFooter}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                {/* Footer Texts */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Textos do Rodapé</h3>
                  {footerTexts.map((text) => (
                    <div key={text.id}>
                      {text.value.length > 50 ? (
                        renderTextArea(text, (value) => {
                          setFooterTexts(footerTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      ) : (
                        renderTextField(text, (value) => {
                          setFooterTexts(footerTexts.map(t => 
                            t.id === text.id ? { ...t, value } : t
                          ));
                        })
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleSaveTexts(footerTexts)}
                    disabled={saving}
                    className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-4 rounded-md transition-colors cursor-pointer"
                  >
                    <Save size={14} />
                    Salvar Textos
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
