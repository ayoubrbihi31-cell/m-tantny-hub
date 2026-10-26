"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot" | "reset";

const TEXT: Record<Mode, { title: string; button: string }> = {
  login: { title: "تسجيل الدخول", button: "دخول" },
  signup: { title: "إنشاء حساب جديد", button: "إنشاء الحساب" },
  forgot: { title: "استعادة كلمة المرور", button: "إرسال رابط الاستعادة" },
  reset: { title: "تحديث كلمة المرور", button: "حفظ كلمة المرور" },
};

function safeNext(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : "/dashboard";
}

function arabicError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (m.includes("not confirmed")) return "يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إليك.";
  if (m.includes("already registered")) return "هذا البريد مسجل بالفعل. جرّب تسجيل الدخول.";
  if (m.includes("rate limit") || m.includes("too many")) return "محاولات كثيرة. انتظر قليلاً ثم أعد المحاولة.";
  if (m.includes("password")) return "كلمة المرور غير مقبولة. استخدم 8 أحرف على الأقل.";
  return "حدث خطأ غير متوقع. أعد المحاولة بعد قليل.";
}

export default function AuthForm({
  mode,
  next,
  initialError,
}: {
  mode: Mode;
  next?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [info, setInfo] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const confirm = String(f.get("confirm") ?? "");
    const name = String(f.get("name") ?? "").trim();

    if (mode !== "reset" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("أدخل بريداً إلكترونياً صحيحاً.");
    if ((mode === "login" || mode === "signup" || mode === "reset") && password.length < 8)
      return setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
    if ((mode === "signup" || mode === "reset") && password !== confirm)
      return setError("كلمتا المرور غير متطابقتين.");

    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(safeNext(next));
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setInfo("تم إنشاء الحساب. راجع بريدك الإلكتروني واضغط على رابط التأكيد.");
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        setInfo("إذا كان البريد مسجلاً لدينا فستصلك رسالة تحتوي على رابط الاستعادة.");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(arabicError(err instanceof Error ? err.message : ""));
    } finally {
      setLoading(false);
    }
  }

  const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30";

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-brand-900">{TEXT[mode].title}</h1>

        {mode === "signup" && (
          <label className="block text-sm font-semibold">
            الاسم
            <input name="name" type="text" required maxLength={80} autoComplete="name" className={`${field} mt-1`} />
          </label>
        )}
        {mode !== "reset" && (
          <label className="block text-sm font-semibold">
            البريد الإلكتروني
            <input name="email" type="email" required autoComplete="email" dir="ltr" className={`${field} mt-1`} />
          </label>
        )}
        {mode !== "forgot" && (
          <label className="block text-sm font-semibold">
            كلمة المرور
            <input name="password" type="password" required minLength={8} dir="ltr"
              autoComplete={mode === "login" ? "current-password" : "new-password"} className={`${field} mt-1`} />
          </label>
        )}
        {(mode === "signup" || mode === "reset") && (
          <label className="block text-sm font-semibold">
            تأكيد كلمة المرور
            <input name="confirm" type="password" required minLength={8} dir="ltr" autoComplete="new-password" className={`${field} mt-1`} />
          </label>
        )}

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {info && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{info}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-brand-800 px-4 py-2.5 font-bold text-white transition hover:bg-brand-900 disabled:opacity-60">
          {loading ? "جارٍ التنفيذ..." : TEXT[mode].button}
        </button>

        <div className="flex flex-col gap-1 text-sm text-slate-600">
          {mode === "login" && (
            <>
              <Link href="/forgot-password" className="text-accent-600 hover:underline">نسيت كلمة المرور؟</Link>
              <span>ليس لديك حساب؟ <Link href="/signup" className="text-accent-600 hover:underline">أنشئ حساباً</Link></span>
            </>
          )}
          {mode === "signup" && (
            <span>لديك حساب؟ <Link href="/login" className="text-accent-600 hover:underline">سجّل الدخول</Link></span>
          )}
          {mode === "forgot" && <Link href="/login" className="text-accent-600 hover:underline">العودة لتسجيل الدخول</Link>}
        </div>
      </form>
    </div>
  );
}
