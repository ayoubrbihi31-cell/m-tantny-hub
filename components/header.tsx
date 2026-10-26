import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";

export function Logo() {
  return (
    <span dir="ltr" className="text-xl font-extrabold tracking-tight text-brand-900">
      M-Tantny <span className="text-accent-600">Hub</span>
    </span>
  );
}

export default async function Header() {
  let signedIn = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = !!data.user;
  } catch {
    signedIn = false;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="M-Tantny Hub - الصفحة الرئيسية">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          {signedIn ? (
            <>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-brand-800 hover:bg-brand-50">
                لوحتي
              </Link>
              <form action={signOut}>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-100">
                  تسجيل الخروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-brand-800 hover:bg-brand-50">
                تسجيل الدخول
              </Link>
              <Link href="/signup" className="rounded-lg bg-brand-800 px-3 py-2 text-white hover:bg-brand-900">
                إنشاء حساب
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
