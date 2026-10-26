import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-accent-600" dir="ltr">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-brand-900">الصفحة غير موجودة</h1>
      <p className="mt-2 text-slate-600">ربما تغير الرابط أو حُذفت الصفحة.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand-800 px-5 py-2.5 font-bold text-white hover:bg-brand-900">
        العودة للرئيسية
      </Link>
    </div>
  );
}
