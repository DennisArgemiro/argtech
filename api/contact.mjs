import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.warn('Firebase env vars not set — run: vercel env pull');
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()\-+]{10,}$/;
const MAX_LENGTH = 2000;

const sanitize = (s) => (s || '').trim().replace(/[<>]/g, '').substring(0, MAX_LENGTH);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, company, service, message } = req.body || {};

    const sName = sanitize(name);
    const sEmail = sanitize(email);
    const sPhone = sanitize(phone);
    const sCompany = sanitize(company);
    const sService = sanitize(service) || 'outro';
    const sMessage = sanitize(message);

    const errors = [];
    if (!sName || sName.length < 2) errors.push('name');
    if (!sEmail || !EMAIL_REGEX.test(sEmail)) errors.push('email');
    if (!sPhone || !PHONE_REGEX.test(sPhone.replace(/\s/g, ''))) errors.push('phone');
    if (!sCompany || sCompany.length < 2) errors.push('company');
    if (!sMessage || sMessage.length < 10) errors.push('message');

    if (errors.length > 0) {
      return res.status(422).json({ error: 'Validation failed', fields: errors });
    }

    await addDoc(collection(db, 'contact_messages'), {
      name: sName,
      email: sEmail,
      phone: sPhone,
      company: sCompany,
      service: sService,
      message: sMessage,
      createdAt: Timestamp.now(),
      read: false,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[Contact API] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
