-- ==========================================
-- MAISON DE CROCS — Full Database Schema
-- ==========================================

-- 1. Categories table
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  old_price INTEGER,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sizes INTEGER[] NOT NULL DEFAULT '{}',
  is_pack BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Product colors (each color has a name, hex, and image URL)
CREATE TABLE public.product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product_colors"
  ON public.product_colors FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage product_colors"
  ON public.product_colors FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Product images (gallery)
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product_images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage product_images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Wilayas tariffs
CREATE TABLE public.wilayas_tariffs (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  domicile INTEGER NOT NULL DEFAULT 0,
  bureau INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.wilayas_tariffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wilayas_tariffs"
  ON public.wilayas_tariffs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage wilayas_tariffs"
  ON public.wilayas_tariffs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('domicile', 'bureau')),
  address TEXT,
  total INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'nouvelle' CHECK (status IN ('nouvelle', 'confirmée', 'expédiée', 'livrée', 'annulée')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (true);

-- 7. Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '',
  size INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert order_items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read order_items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete order_items"
  ON public.order_items FOR DELETE
  TO authenticated
  USING (true);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed categories
INSERT INTO public.categories (id, label) VALUES
  ('femme', 'Femme'),
  ('homme', 'Homme'),
  ('enfant', 'Enfant');

-- Seed wilayas tariffs (all 58)
INSERT INTO public.wilayas_tariffs (id, name, domicile, bureau) VALUES
  (1, 'Adrar', 1200, 800),
  (2, 'Chlef', 700, 400),
  (3, 'Laghouat', 900, 600),
  (4, 'Oum El Bouaghi', 800, 500),
  (5, 'Batna', 800, 500),
  (6, 'Béjaïa', 700, 400),
  (7, 'Biskra', 900, 600),
  (8, 'Béchar', 1200, 800),
  (9, 'Blida', 500, 300),
  (10, 'Bouira', 600, 400),
  (11, 'Tamanrasset', 1500, 1000),
  (12, 'Tébessa', 900, 600),
  (13, 'Tlemcen', 800, 500),
  (14, 'Tiaret', 800, 500),
  (15, 'Tizi Ouzou', 600, 400),
  (16, 'Alger', 400, 250),
  (17, 'Djelfa', 800, 500),
  (18, 'Jijel', 800, 500),
  (19, 'Sétif', 700, 400),
  (20, 'Saïda', 900, 600),
  (21, 'Skikda', 800, 500),
  (22, 'Sidi Bel Abbès', 800, 500),
  (23, 'Annaba', 700, 400),
  (24, 'Guelma', 800, 500),
  (25, 'Constantine', 600, 400),
  (26, 'Médéa', 600, 400),
  (27, 'Mostaganem', 700, 400),
  (28, 'M''Sila', 800, 500),
  (29, 'Mascara', 800, 500),
  (30, 'Ouargla', 1000, 700),
  (31, 'Oran', 600, 400),
  (32, 'El Bayadh', 1000, 700),
  (33, 'Illizi', 1500, 1000),
  (34, 'Bordj Bou Arréridj', 700, 400),
  (35, 'Boumerdès', 500, 300),
  (36, 'El Tarf', 800, 500),
  (37, 'Tindouf', 1500, 1000),
  (38, 'Tissemsilt', 800, 500),
  (39, 'El Oued', 1000, 700),
  (40, 'Khenchela', 900, 600),
  (41, 'Souk Ahras', 800, 500),
  (42, 'Tipaza', 500, 300),
  (43, 'Mila', 800, 500),
  (44, 'Aïn Defla', 700, 400),
  (45, 'Naâma', 1000, 700),
  (46, 'Aïn Témouchent', 800, 500),
  (47, 'Ghardaïa', 1000, 700),
  (48, 'Relizane', 700, 400),
  (49, 'El M''Ghair', 1000, 700),
  (50, 'El Meniaa', 1200, 800),
  (51, 'Ouled Djellal', 900, 600),
  (52, 'Bordj Badji Mokhtar', 1500, 1000),
  (53, 'Béni Abbès', 1200, 800),
  (54, 'Timimoun', 1500, 1000),
  (55, 'Touggourt', 1000, 700),
  (56, 'Djanet', 1500, 1000),
  (57, 'In Salah', 1500, 1000),
  (58, 'In Guezzam', 1500, 1000);

-- Seed products
INSERT INTO public.products (id, name, price, old_price, description, category, sizes, is_pack) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Classic Clog Noir', 4500, 5500, 'Le sabot classique par excellence. Confort ultime, légèreté incomparable. Idéal pour toutes les occasions.', 'homme', ARRAY[39,40,41,42,43,44,45], false),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Classic Clog Blanc', 4500, NULL, 'Élégance pure en blanc. Un indispensable pour l''été algérien.', 'femme', ARRAY[36,37,38,39,40,41], false),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Platform Clog', 6200, 7800, 'Plateforme audacieuse pour un style affirmé. Semelle épaisse, confort maximal.', 'femme', ARRAY[36,37,38,39,40,41], false),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Clog Fourré Confort', 5800, 7200, 'Doublure chaude et moelleuse. Parfait pour les soirées fraîches.', 'femme', ARRAY[36,37,38,39,40,41,42], false),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'Kids Classic Rose', 3200, 3800, 'Fun et confortable pour les petits pieds. Couleurs vives, sourires garantis.', 'enfant', ARRAY[24,25,26,27,28,29,30,31,32], false),
  ('a1b2c3d4-0001-4000-8000-000000000006', 'Slide Classique', 3800, NULL, 'La slide minimaliste. Glisser, marcher, conquérir.', 'homme', ARRAY[39,40,41,42,43,44,45], false),
  ('a1b2c3d4-0001-4000-8000-000000000007', 'Pack Duo Classique', 7900, 10000, 'Deux paires classiques noir et blanc. L''offre idéale pour ne jamais choisir.', 'homme', ARRAY[39,40,41,42,43,44,45], true),
  ('a1b2c3d4-0001-4000-8000-000000000008', 'Pack Famille', 11500, 14500, 'Un pack pour toute la famille. Homme, femme et enfant réunis.', 'enfant', ARRAY[24,25,26,27,28,36,37,38,39,40,41,42,43], true);

-- Seed product colors
INSERT INTO public.product_colors (product_id, name, hex, image, sort_order) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Noir', '#000000', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Blanc', '#FFFFFF', '', 1),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Blanc', '#FFFFFF', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Noir', '#000000', '', 1),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Noir', '#000000', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Beige', '#E8D5C4', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'Rose', '#FF69B4', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000006', 'Noir', '#000000', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000007', 'Noir', '#000000', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000007', 'Blanc', '#FFFFFF', '', 1),
  ('a1b2c3d4-0001-4000-8000-000000000008', 'Noir', '#000000', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000008', 'Rose', '#FF69B4', '', 1);

-- Seed product images
INSERT INTO public.product_images (product_id, url, sort_order) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000001', '', 1),
  ('a1b2c3d4-0001-4000-8000-000000000002', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000002', '', 1),
  ('a1b2c3d4-0001-4000-8000-000000000003', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000004', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000005', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000006', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000007', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000007', '', 1),
  ('a1b2c3d4-0001-4000-8000-000000000008', '', 0),
  ('a1b2c3d4-0001-4000-8000-000000000008', '', 1);
