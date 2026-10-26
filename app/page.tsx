import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const PRICING: Record<string, string> = {
  free: "مجاني",
  paid: "مدفوع",
  freemium: "مجاني ومدفوع",
  unknown: "السعر غير محدد",
};

const FEATURES = [
  ["أدوات منتقاة", "دليل عربي لأدوات الذكاء الاصطناعي والتصميم وصناعة المحتوى."],
  ["خدمات رقمية", "طلب خدمات التصميم وكتابة المحتوى من مكان واحد."],
  ["متجر رقمي", "منتجات رقمية جاهزة للمبتدئين وأصحاب المشاريع الصغيرة."],
  ["مدونة عملية", "مقالات مبسطة تساعدك على البدء خطوة بخطوة."],
];

const FAQ = [
  ["هل المنصة مجانية؟", "تصفح الأدوات مجاني. بعض الخدمات والمنتجات ستكون مدفوعة عند إطلاقها."],
  ["هل تنشئ المنصة الصور أو النصوص بالذكاء الاصطناعي؟", "لا. المنصة دليل يعرّفك بالأدوات ويقودك إلى مواقعها الرسمية."],
  ["هل أحتاج إلى حساب؟", "الحساب مطلوب لحفظ المفضلة ومتابعة الطلبات."],
];

async function getTools() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tools")
      .select("id, name, description, pricing")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const tools = await getTools();

  return (
    <>
      <section className="bg-linear-to-br from-brand-900 via-brand-800 to-accent-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-snug sm:text-5xl sm:leading-tight">
            أدواتك الرقمية وخدماتك وصناعة المحتوى في مكان واحد
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            منصة عربية تساعد المبتدئين وصناع المحتوى وأصحاب المشاريع الصغيرة على اختيار الأدوات المناسبة والبدء بثقة.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#tools" className="rounded-lg bg-white px-5 py-3 font-bold text-brand-900 hover:bg-brand-50">
              استكشف الأدوات
            </Link>
            <Link href="/signup" className="rounded-lg border border-white/60 px-5 py-3 font-bold hover:bg-white/10">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="text-2xl font-extrabold text-brand-900">أدوات مميزة</h2>
        {tools.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
            لا توجد أدوات منشورة حالياً.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-brand-800" dir="auto">{t.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{t.description}</p>
                <span className="mt-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {PRICING[t.pricing] ?? PRICING.unknown}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="text-2xl font-extrabold text-brand-900">ماذا تقدم المنصة؟</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-brand-800">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-14">
        <h2 className="text-2xl font-extrabold text-brand-900">أسئلة شائعة</h2>
        <div className="mt-4 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold text-brand-800">{q}</summary>
              <p className="mt-2 text-sm text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
