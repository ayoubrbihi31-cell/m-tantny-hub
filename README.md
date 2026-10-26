# M-Tantny Hub

منصة عربية للأدوات الرقمية والذكاء الاصطناعي وصناعة المحتوى.
التقنيات: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase.

## حالة المشروع: المرحلة 1 (لم تُبنَ ولم تُختبر بعد)

**في الكود:** الصفحة الرئيسية، التسجيل، الدخول، الخروج، استعادة وتحديث كلمة المرور، حماية /dashboard و/admin، لوحة مستخدم ولوحة مدير أساسيتان، صفحة 404 وصفحة خطأ، وملفات SQL للجداول وسياسات RLS.

**غير منفذ بعد:** /tools و/services و/store و/blog و/about و/contact، المفضلة، شاشات إدارة المحتوى، الدفع، ESLint، الاختبارات.

**تنبيه:** لم يُنفذ `npm install` ولا `build` على هذا الكود. أول build على Vercel هو أول اختبار حقيقي.

## ملفات SQL (نفذها بالترتيب في Supabase → SQL Editor)

1. `supabase/migrations/20261026000001_schema.sql`
2. `supabase/migrations/20261026000002_rls.sql`
3. `supabase/migrations/20261026000003_seed.sql`

## متغيرات البيئة (تضاف في Vercel)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (المفتاح العام فقط)

## تعيين أول مدير (من SQL Editor فقط)

بعد إنشاء حسابك من الموقع:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'بريدك@example.com');
```

لا توجد طريقة لترقية حساب إلى مدير من داخل الموقع.

## ملاحظة

رابط تأكيد البريد أو استعادة كلمة المرور يجب فتحه في نفس المتصفح الذي سجلت منه.
