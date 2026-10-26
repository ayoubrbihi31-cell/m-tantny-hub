-- 2) سياسات الأمان RLS. نفّذ هذا الملف بعد الأول.
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.favorites enable row level security;
alter table public.articles enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.service_requests enable row level security;

-- صلاحيات صريحة بأقل قدر لازم (RLS تقيّد الصفوف فوقها)
revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.tools, public.articles, public.products, public.services to anon, authenticated;
grant insert, update, delete on public.categories, public.tools, public.articles, public.products, public.services to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;  -- ليس role
grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update, delete on public.orders, public.order_items to authenticated;
grant insert on public.service_requests to anon;
grant select, insert, update on public.service_requests to authenticated;

create policy "profiles_select_own_or_admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

create policy "categories_read" on public.categories for select using (true);
create policy "categories_admin" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy "tools_read" on public.tools for select using (is_published or public.is_admin());
create policy "tools_admin" on public.tools for all
  using (public.is_admin()) with check (public.is_admin());

create policy "articles_read" on public.articles for select using (is_published or public.is_admin());
create policy "articles_admin" on public.articles for all
  using (public.is_admin()) with check (public.is_admin());

create policy "products_read" on public.products for select using (is_published or public.is_admin());
create policy "products_admin" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

create policy "services_read" on public.services for select using (is_published or public.is_admin());
create policy "services_admin" on public.services for all
  using (public.is_admin()) with check (public.is_admin());

create policy "favorites_own_select" on public.favorites for select using (user_id = auth.uid());
create policy "favorites_own_insert" on public.favorites for insert with check (user_id = auth.uid());
create policy "favorites_own_delete" on public.favorites for delete using (user_id = auth.uid());

-- الطلبات: قراءة فقط للمالك أو المدير. إنشاء الطلبات سيتم لاحقاً عبر الخادم (لا يُسمح للمتصفح بتحديد الأسعار أو حالة الدفع).
create policy "orders_read" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "orders_admin" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

create policy "order_items_read" on public.order_items for select using (
  public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "order_items_admin" on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

create policy "service_requests_insert" on public.service_requests for insert
  with check (status = 'new' and (user_id is null or user_id = auth.uid()));
create policy "service_requests_read" on public.service_requests for select
  using (user_id = auth.uid() or public.is_admin());
create policy "service_requests_admin_update" on public.service_requests for update
  using (public.is_admin()) with check (public.is_admin());
