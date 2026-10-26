import AuthForm from "@/components/auth-form";

export const metadata = { title: "استعادة كلمة المرور | M-Tantny Hub" };

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
