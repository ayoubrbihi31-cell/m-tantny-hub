import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "لوحة المدير | M-Tantny Hub" };

const TABLES = [
  ["tools", "الأدوات"],
  ["articles", "المقالات"],
  ["products", "المنتجات"],
  ["services", "الخدمات"],
  ["orders", "الطلبات"],
] as const;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const counts = await Promise.all(
    TABLES.map(async ([table, label]) => {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      return { label, count: count ?? 0 };
    })
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-brand-900">لوحة المدير</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {counts.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-extrabold text-brand-800">{c.count}</div>
            <div className="text-sm text-slate-600">{c.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        شاشات إضافة وتعديل المحتوى ستضاف في المرحلة التالية. الأرقام أعلاه من قاعدة البيانات مباشرة.
      </p>
    </div>
  );
}
