-- Supabase Schema for ArgTech Website with Row Level Security

-- Enable RLS on all tables
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Tabela de configurações do site
CREATE TABLE site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de navegação
CREATE TABLE navigation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  icon TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens do carrossel
CREATE TABLE carousel_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'phone', 'email', 'whatsapp', 'instagram', 'linkedin'
  value TEXT NOT NULL,
  label TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de textos do site
CREATE TABLE site_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'hero', 'services', 'benefits', 'contact', 'footer'
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Tabela de imagens gerais
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT, -- 'logo', 'banner', 'service', 'project'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens de contato (novo)
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO navigation (label, href, order_index) VALUES
  ('Início', '#hero', 1),
  ('Serviços', '#services', 2),
  ('Benefícios', '#benefits', 3),
  ('Contato', '#contact', 4);

INSERT INTO site_texts (section, key, value) VALUES
  ('hero', 'tagline', 'ARGTECH'),
  ('hero', 'title_line1', 'SOLUÇÕES'),
  ('hero', 'title_line2', 'QUE CONECTAM.'),
  ('hero', 'title_line3', 'TECNOLOGIA QUE'),
  ('hero', 'title_line4', 'IMPULSIONA.'),
  ('hero', 'description', 'Transformamos desafios em soluções inteligentes para o seu negócio crescer sem limites.'),
  ('hero', 'cta_primary', 'NOSSOS SERVIÇOS'),
  ('hero', 'cta_secondary', 'FALAR COM ESPECIALISTA'),
  ('services', 'tagline', 'NOSSOS SERVIÇOS'),
  ('services', 'title', 'Soluções completas para o seu negócio'),
  ('services', 'description', 'Oferecemos tecnologia sob medida para otimizar processos, integrar sistemas e impulsionar resultados.'),
  ('benefits', 'tagline', 'POR QUE ESCOLHER A ARGTECH?'),
  ('benefits', 'title', 'Tecnologia com propósito. Resultados que ficam.'),
  ('contact', 'title', 'Pronto para levar sua empresa para o próximo nível?'),
  ('contact', 'description', 'Fale com a nossa equipe e descubra a melhor solução para o seu negócio.'),
  ('footer', 'company_name', 'ARGTECH SOLUÇÕES EM INFORMÁTICA'),
  ('footer', 'slogan', 'Tecnologia que conecta. Soluções que transformam.');

INSERT INTO contacts (type, value, label) VALUES
  ('phone', '(XX) XXXX-XXXX', 'Telefone'),
  ('email', 'contato@argtech.com.br', 'Email'),
  ('whatsapp', '5521987654321', 'WhatsApp');

-- RLS Policies

-- Public read access for published content
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read navigation" ON navigation FOR SELECT USING (visible = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (visible = true);
CREATE POLICY "Public read carousel_images" ON carousel_images FOR SELECT USING (visible = true);
CREATE POLICY "Public read contacts" ON contacts FOR SELECT USING (visible = true);
CREATE POLICY "Public read site_texts" ON site_texts FOR SELECT USING (true);
CREATE POLICY "Public read images" ON images FOR SELECT USING (true);

-- Admin full access (authenticated users with admin role)
CREATE POLICY "Admin all site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin all navigation" ON navigation FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin all services" ON services FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin all carousel_images" ON carousel_images FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin all contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin all site_texts" ON site_texts FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin all images" ON images FOR ALL USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');

-- Contact messages: anyone can insert, only admins can read/update
CREATE POLICY "Anyone can insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact_messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin update contact_messages" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');
CREATE POLICY "Admin delete contact_messages" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin');

-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_navigation_order ON navigation(order_index);
CREATE INDEX idx_services_order ON services(order_index);
CREATE INDEX idx_carousel_order ON carousel_images(order_index);
CREATE INDEX idx_site_texts_section ON site_texts(section);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);