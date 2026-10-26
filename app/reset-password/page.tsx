import { redirect } from "next/navigation";
import AuthForm from "@/components/auth-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "تحديث كلمة المرور | M-Tantny Hub" };

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/forgot-password");
  return <AuthForm mode="reset" />;
}
