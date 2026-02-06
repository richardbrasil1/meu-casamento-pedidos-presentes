
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: only admins can see roles
CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Wedding info table
CREATE TABLE public.wedding_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple TEXT NOT NULL DEFAULT 'Caroline & Richard',
  date TEXT NOT NULL DEFAULT '07 de Março de 2026',
  message TEXT NOT NULL DEFAULT 'Estamos muito felizes em compartilhar esse momento com vocês! Aqui está nossa lista de presentes para nos ajudar a começar essa nova etapa juntos. 💕',
  phone TEXT NOT NULL DEFAULT '(11) 99999-9999',
  email TEXT NOT NULL DEFAULT 'caroline.richard@email.com',
  address TEXT NOT NULL DEFAULT 'Rua das Flores, 123 - São Paulo, SP',
  pix_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_info ENABLE ROW LEVEL SECURITY;

-- Anyone can read wedding info
CREATE POLICY "Anyone can view wedding info"
  ON public.wedding_info FOR SELECT
  USING (true);

-- Only admins can update wedding info
CREATE POLICY "Admins can update wedding info"
  ON public.wedding_info FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Gifts table
CREATE TABLE public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  link TEXT,
  image TEXT,
  purchased BOOLEAN NOT NULL DEFAULT false,
  purchased_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Anyone can view gifts
CREATE POLICY "Anyone can view gifts"
  ON public.gifts FOR SELECT
  USING (true);

-- Anyone can mark a gift as purchased (update purchased and purchased_by only)
CREATE POLICY "Anyone can claim gifts"
  ON public.gifts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Only admins can insert gifts
CREATE POLICY "Admins can insert gifts"
  ON public.gifts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete gifts
CREATE POLICY "Admins can delete gifts"
  ON public.gifts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger for wedding_info
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_wedding_info_updated_at
  BEFORE UPDATE ON public.wedding_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for gifts
ALTER PUBLICATION supabase_realtime ADD TABLE public.gifts;

-- Insert default wedding info
INSERT INTO public.wedding_info (couple, date, message, phone, email, address, pix_key)
VALUES (
  'Caroline & Richard',
  '07 de Março de 2026',
  'Estamos muito felizes em compartilhar esse momento com vocês! Aqui está nossa lista de presentes para nos ajudar a começar essa nova etapa juntos. 💕',
  '(11) 99999-9999',
  'caroline.richard@email.com',
  'Rua das Flores, 123 - São Paulo, SP',
  'caroline.richard@email.com'
);

-- Insert default gifts
INSERT INTO public.gifts (name, description, price) VALUES
  ('Jogo de Panelas', 'Jogo de panelas antiaderente com 5 peças', 350),
  ('Jogo de Cama Queen', 'Jogo de cama 400 fios, algodão egípcio', 280),
  ('Cafeteira Elétrica', 'Cafeteira programável com jarra térmica', 450),
  ('Aspirador Robô', 'Aspirador robô com mapeamento inteligente', 1200),
  ('Jogo de Toalhas', 'Kit com 8 toalhas de banho e rosto', 180),
  ('Air Fryer', 'Fritadeira elétrica 5 litros digital', 550);
