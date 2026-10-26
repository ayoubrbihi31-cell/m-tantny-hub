"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-brand-900">حدث خطأ غير متوقع</h1>
      <p className="mt-2 text-slate-600">حاول مرة أخرى. إذا استمرت المشكلة فتواصل معنا لاحقاً.</p>
      <button onClick={reset} className="mt-6 rounded-lg bg-brand-800 px-5 py-2.5 font-bold text-white hover:bg-brand-900">
        إعادة المحاولة
      </button>
    </div>
  );
}
