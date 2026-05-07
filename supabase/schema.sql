-- ============================================================
-- Alluvi / Retatrutide Research Center — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- -------------------------------------------------------
-- 0. Extensions
-- -------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- -------------------------------------------------------
-- 1. PROFILES
--    Must come first — referenced by all other tables.
--    Mirrors auth.users (one-to-one).
-- -------------------------------------------------------
CREATE TABLE public.profiles (
  id           uuid        NOT NULL,
  email        text        NOT NULL UNIQUE,
  first_name   text,
  last_name    text,
  full_name    text,
  avatar_url   text,
  is_admin     boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);


-- -------------------------------------------------------
-- 2. CATEGORIES
-- -------------------------------------------------------
CREATE TABLE public.categories (
  id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
  name       text        NOT NULL,
  slug       text        NOT NULL UNIQUE,
  icon_url   text,
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT categories_pkey PRIMARY KEY (id)
);


-- -------------------------------------------------------
-- 3. PRODUCTS
--    Duplicate columns from the original schema have been
--    merged: image_url → main_image_url,
--            image_url_2 → secondary_image_1_url,
--            stock → stock_quantity,
--            is_promo → has_promotion,
--            category_name text → category_id FK.
--    The redundant "status" column is replaced by is_active.
-- -------------------------------------------------------
CREATE TABLE public.products (
  id                     uuid        NOT NULL DEFAULT uuid_generate_v4(),
  name                   text        NOT NULL,
  description            text,
  price                  numeric     NOT NULL CHECK (price >= 0),
  has_promotion          boolean     NOT NULL DEFAULT false,
  promotion_percentage   integer     NOT NULL DEFAULT 0
                           CHECK (promotion_percentage >= 0 AND promotion_percentage <= 100),
  main_image_url         text,
  secondary_image_1_url  text,
  secondary_image_2_url  text,
  coa_url                text,
  stock_quantity         integer     NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active              boolean     NOT NULL DEFAULT true,
  category_id            uuid        REFERENCES public.categories (id) ON DELETE SET NULL,
  created_by             uuid        REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT products_pkey PRIMARY KEY (id)
);


-- -------------------------------------------------------
-- 4. CART
-- -------------------------------------------------------
CREATE TABLE public.cart (
  id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id    uuid        NOT NULL REFERENCES public.profiles (id)  ON DELETE CASCADE,
  product_id uuid        NOT NULL REFERENCES public.products (id)  ON DELETE CASCADE,
  quantity   integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT cart_pkey             PRIMARY KEY (id),
  CONSTRAINT cart_user_product_key UNIQUE (user_id, product_id)
);


-- -------------------------------------------------------
-- 5. ORDERS
-- -------------------------------------------------------
CREATE TABLE public.orders (
  id               uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id          uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  reference_code   text        NOT NULL UNIQUE
                     DEFAULT ('ALV-' || upper(substring(gen_random_uuid()::text FROM 1 FOR 6))),
  order_reference  text        UNIQUE,

  -- Billing address
  first_name       text,
  last_name        text,
  email_address    text,
  phone            text        NOT NULL,
  street_address   text        NOT NULL,
  apartment_suite  text,
  town_city        text,
  county           text,
  postcode         text,
  country          text        NOT NULL DEFAULT 'United Kingdom (UK)',
  company_name     text,

  -- Financials
  subtotal         numeric     NOT NULL DEFAULT 0.00,
  discount_amount  numeric     NOT NULL DEFAULT 0.00,
  shipping_fee     numeric     NOT NULL DEFAULT 30.00,
  total_amount     numeric     NOT NULL,

  -- Payment & status
  payment_method   text        NOT NULL DEFAULT 'bank_transfer',
  status           text        NOT NULL DEFAULT 'pending'
                     CHECK (status IN (
                       'on_hold', 'pending', 'confirmed',
                       'cancelled', 'rejected', 'shipped', 'delivered'
                     )),

  -- Timestamps
  created_at       timestamptz NOT NULL DEFAULT now(),
  confirmed_at     timestamptz,
  confirmed_by     uuid        REFERENCES public.profiles (id) ON DELETE SET NULL,

  CONSTRAINT orders_pkey PRIMARY KEY (id)
);


-- -------------------------------------------------------
-- 6. ORDER ITEMS
-- -------------------------------------------------------
CREATE TABLE public.order_items (
  id                   uuid        NOT NULL DEFAULT uuid_generate_v4(),
  order_id             uuid        NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id           uuid        REFERENCES public.products (id) ON DELETE SET NULL,
  product_name         text        NOT NULL,
  quantity             integer     NOT NULL CHECK (quantity > 0),
  unit_price           numeric     NOT NULL,
  price_at_time        numeric     NOT NULL DEFAULT 0,
  promotion_applied    boolean     NOT NULL DEFAULT false,
  discount_percentage  integer     NOT NULL DEFAULT 0,
  subtotal             numeric     GENERATED ALWAYS AS
                         (quantity * unit_price * (1 - discount_percentage::numeric / 100))
                         STORED,
  created_at           timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT order_items_pkey PRIMARY KEY (id)
);


-- -------------------------------------------------------
-- 7. CHAT CONVERSATIONS
-- -------------------------------------------------------
CREATE TABLE public.chat_conversations (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id         uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  admin_id        uuid        REFERENCES public.profiles (id) ON DELETE SET NULL,
  status          text        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'closed')),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chat_conversations_pkey PRIMARY KEY (id)
);


-- -------------------------------------------------------
-- 8. CHAT MESSAGES
-- -------------------------------------------------------
CREATE TABLE public.chat_messages (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
  conversation_id uuid        NOT NULL REFERENCES public.chat_conversations (id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  message_type    text        NOT NULL DEFAULT 'text'
                    CHECK (message_type IN ('text', 'image', 'voice')),
  content         text,
  file_url        text,
  is_read         boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_content_or_file
    CHECK (content IS NOT NULL OR file_url IS NOT NULL)
);


-- ============================================================
-- TRIGGERS — auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_cart_updated_at
  BEFORE UPDATE ON public.cart
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- TRIGGER — sync auth.users → profiles on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages      ENABLE ROW LEVEL SECURITY;


-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
CREATE POLICY "profiles: users read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles: admins read all"
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  ));


-- -------------------------------------------------------
-- categories  (public read, admin write)
-- -------------------------------------------------------
CREATE POLICY "categories: public read"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories: admin insert"
  ON public.categories FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "categories: admin update"
  ON public.categories FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "categories: admin delete"
  ON public.categories FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));


-- -------------------------------------------------------
-- products  (public read active, admin full access)
-- -------------------------------------------------------
CREATE POLICY "products: public read active"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "products: admin read all"
  ON public.products FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "products: admin insert"
  ON public.products FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "products: admin update"
  ON public.products FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "products: admin delete"
  ON public.products FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));


-- -------------------------------------------------------
-- cart  (users manage own cart)
-- -------------------------------------------------------
CREATE POLICY "cart: users read own"
  ON public.cart FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cart: users insert own"
  ON public.cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart: users update own"
  ON public.cart FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "cart: users delete own"
  ON public.cart FOR DELETE
  USING (auth.uid() = user_id);


-- -------------------------------------------------------
-- orders  (users own, admins all)
-- -------------------------------------------------------
CREATE POLICY "orders: users read own"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders: users insert own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders: admins read all"
  ON public.orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "orders: admins update all"
  ON public.orders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));


-- -------------------------------------------------------
-- order_items  (via orders ownership)
-- -------------------------------------------------------
CREATE POLICY "order_items: users read own"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id AND o.user_id = auth.uid()
  ));

CREATE POLICY "order_items: users insert own"
  ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id AND o.user_id = auth.uid()
  ));

CREATE POLICY "order_items: admins all"
  ON public.order_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));


-- -------------------------------------------------------
-- chat_conversations
-- -------------------------------------------------------
CREATE POLICY "chat_conversations: users read own"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "chat_conversations: users insert own"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_conversations: admins all"
  ON public.chat_conversations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));


-- -------------------------------------------------------
-- chat_messages
-- -------------------------------------------------------
CREATE POLICY "chat_messages: participants read"
  ON public.chat_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id
        AND (c.user_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

CREATE POLICY "chat_messages: participants insert"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id
        AND (c.user_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

CREATE POLICY "chat_messages: admins all"
  ON public.chat_messages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));


-- ============================================================
-- STORAGE BUCKETS
-- Run in Supabase Dashboard → Storage, or via SQL below.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products',     'products',     true),
  ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read product images
CREATE POLICY "storage products: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Only admins can upload/delete product images
CREATE POLICY "storage products: admin write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "storage products: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products'
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- COA/certificates: authenticated users read, admins write
CREATE POLICY "storage certificates: auth read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "storage certificates: admin write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'certificates'
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );


-- ============================================================
-- REALTIME  (enable for live chat)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
