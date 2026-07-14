import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminHoneypot from './components/AdminHoneypot';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

type Page = 'home' | 'admin' | 'honeypot';

const ADMIN_PATH = (import.meta.env.VITE_ADMIN_SECRET_PATH || 'gestao-argtech').replace(/^\//, '');

const HONEYPOT_PATHS = [
  '/admin',
  '/administrador',
  '/painel',
  '/backend',
  '/controle',
  '/gerenciamento',
  '/painel-de-controle',
  '/administrativo',
];

function matchHoneypot(path: string): boolean {
  return HONEYPOT_PATHS.includes(path);
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          setIsAdmin(tokenResult.claims.admin === true);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const path = window.location.pathname;

    if (path === `/${ADMIN_PATH}`) {
      setPage('admin');
    } else if (matchHoneypot(path)) {
      setPage('honeypot');
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sections = ['hero', 'services', 'about', 'projects', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectService = (_serviceTitle: string) => {
    scrollToSection('contact');
  };

  if (page === 'honeypot') {
    return <AdminHoneypot />;
  }

  if (page === 'admin') {
    if (!isAdmin) {
      return <AdminLogin onLogin={() => setIsAdmin(true)} />;
    }
    return <AdminDashboard onLogout={() => { setIsAdmin(false); setPage('home'); }} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#3533CD]/40 selection:text-white antialiased">
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />
      <Hero onNavigate={scrollToSection} />
      <Services onSelectService={handleSelectService} />
      <About />
      <Projects />
      <ContactForm />
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
