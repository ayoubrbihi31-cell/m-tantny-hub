import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "لوحتي | M-Tantny Hub" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", data.user.id)
    .single();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-brand-900">
        مرحباً {profile?.full_name ?? ""}
      </h1>
      <p className="mt-2 text-slate-600" dir="ltr">{data.user.email}</p>
      {profile?.role === "admin" && (
        <Link href="/admin" className="mt-6 inline-block rounded-lg bg-accent-600 px-4 py-2 font-bold text-white hover:bg-accent-500">
          لوحة المدير
        </Link>
      )}
      <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        المفضلة والطلبات وإعدادات الحساب ستضاف في المراحل التالية.
      </p>
    </div>
  );
}
