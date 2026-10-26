-- 1) الجداول الأساسية. نفّذ هذا الملف أولاً.
create type public.app_role as enum ('user', 'admin');
create type public.pricing_type as enum ('free', 'paid', 'freemium', 'unknown');
create type public.order_status as enum ('pending', 'confirmed', 'cancelled');

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) <= 80),
  avatar_url text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  website_url text,
  usage_type text,
  pricing public.pricing_type not null default 'unknown',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, tool_id)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'MAD',
  image_url text,
  product_type text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer check (price_cents >= 0),
  currency text not null default 'MAD',
  image_url text,
  delivery_days integer check (delivery_days > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status not null default 'pending',
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  total_cents integer not null default 0 check (total_cents >= 0),
  currency text not null default 'MAD',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  service_id uuid not null references public.services(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  email text not null check (char_length(email) between 5 and 254),
  details text not null check (char_length(details) between 10 and 2000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);

create index on public.tools (category_id);
create index on public.tools (is_published, is_featured);
create index on public.articles (is_published, published_at desc);
create index on public.favorites (tool_id);
create index on public.orders (user_id);
create index on public.order_items (order_id);
create index on public.service_requests (service_id);

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_tools_updated before update on public.tools for each row execute function public.set_updated_at();
create trigger trg_articles_updated before update on public.articles for each row execute function public.set_updated_at();
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();
create trigger trg_services_updated before update on public.services for each row execute function public.set_updated_at();

-- إنشاء profile تلقائياً عند التسجيل. الدور دائماً user.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''), 80));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- منع تغيير role من أي طلب قادم من التطبيق. التغيير مسموح فقط من SQL Editor.
create function public.protect_role() returns trigger
language plpgsql as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'غير مسموح بتغيير الدور';
  end if;
  return new;
end $$;

create trigger trg_protect_role before update on public.profiles
for each row execute function public.protect_role();

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
