import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface FooterInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
}

const DEFAULT_FOOTER_INFO: FooterInfo = {
  id: '',
  phone: '(XX) XXXX-XXXX',
  email: 'contato@argtech.com.br',
  address: 'Sua cidade/UF',
  whatsapp: '5521987654321',
  instagram: 'https://instagram.com/argtech',
  linkedin: 'https://linkedin.com/company/argtech',
};

export function useFooterInfo() {
  const [footerInfo, setFooterInfo] = useState<FooterInfo>(DEFAULT_FOOTER_INFO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFooterInfo = async () => {
      try {
        const footerSnapshot = await getDocs(collection(db, 'footer_info'));
        const footerDoc = footerSnapshot.docs[0];
        if (footerDoc) {
          setFooterInfo({
            id: footerDoc.id,
            ...footerDoc.data()
          } as FooterInfo);
        }
      } catch (err) {
        console.error('Error loading footer info:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadFooterInfo();
  }, []);

  return { footerInfo, loading, error };
}