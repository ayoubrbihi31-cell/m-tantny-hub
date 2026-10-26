import AuthForm from "@/components/auth-form";

export const metadata = { title: "تسجيل الدخول | M-Tantny Hub" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <AuthForm
      mode="login"
      next={next}
      initialError={error ? "تعذر تأكيد الرابط أو انتهت صلاحيته. حاول مرة أخرى." : undefined}
    />
  );
}
