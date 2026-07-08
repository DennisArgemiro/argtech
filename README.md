# ArgTech - Soluções em Informática

Site institucional da ArgTech, empresa especializada em desenvolvimento de software, automação comercial, integração de sistemas e infraestrutura de TI.

## 🚀 Tecnologias

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (Framer Motion)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deploy**: Vercel / Netlify

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd argtech

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase

# Execute em desenvolvimento
npm run dev
```

## 🔐 Configuração de Segurança

### Variáveis de Ambiente Obrigatórias

Crie um arquivo `.env.local` com:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=1:seu_sender_id:web:seu_app_id
```

> **⚠️ IMPORTANTE**: Nunca commite o arquivo `.env.local` ou `.env`! Eles contêm credenciais sensíveis. O `.gitignore` já está configurado para ignorá-los.

### Firebase Security Rules

Configure as regras do Firestore no console do Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Conteúdo público - leitura para todos
    match /site_texts/{doc} { allow read: if true; }
    match /services/{doc} { allow read: if resource.data.visible == true; }
    match /carousel_slides/{doc} { allow read: if resource.data.visible == true; }
    match /navigation/{doc} { allow read: if resource.data.visible == true; }
    match /contacts/{doc} { allow read: if resource.data.visible == true; }
    match /images/{doc} { allow read: if true; }
    
    // Mensagens de contato - apenas admins podem ler
    match /contact_messages/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Admin - acesso total autenticado
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Headers de Segurança

O projeto inclui headers de segurança configurados para:
- **Netlify**: `netlify.toml`
- **Vercel**: `vercel.json`

Headers aplicados:
- `Content-Security-Policy` (CSP)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security` (HSTS)

## 🛠️ Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # TypeScript + ESLint
npm run lint:fix  # Corrige problemas do ESLint
npm run clean     # Limpa build anterior
```

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes React reutilizáveis
├── pages/          # Páginas (AdminDashboard, AdminLogin)
├── lib/            # Configurações (Firebase)
├── types.ts        # Tipos TypeScript
├── data.ts         # Dados estáticos
├── App.tsx         # Componente principal
└── main.tsx        # Entry point

supabase/
└── schema.sql      # Schema do banco com RLS
```

## 🔒 Checklist de Segurança (Produção)

- [ ] Credenciais do Firebase configuradas apenas no painel de deploy (não no código)
- [ ] Regras do Firestore aplicadas no console
- [ ] Authentication do Firebase configurado (Email/Password)
- [ ] Usuário admin criado com custom claim `admin: true`
- [ ] Domínio personalizado configurado com HTTPS
- [ ] Headers de segurança verificados no browser (DevTools > Network)
- [ ] CSP testado e sem erros no console
- [ ] Rate limiting configurado no Firebase Auth
- [ ] Monitoramento de erros configurado (Sentry, LogRocket, etc.)

## 📄 Licença

Proprietário - ArgTech Soluções em Informática