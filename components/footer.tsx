import { Logo } from "@/components/header";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-600">
        <Logo />
        <p>منصة عربية للأدوات الرقمية والذكاء الاصطناعي وصناعة المحتوى.</p>
        <p>© {new Date().getFullYear()} M-Tantny Hub</p>
      </div>
    </footer>
  );
}
