import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminUserLoginPage() {
  return (
    <AdminLoginForm
      title="Admin Login"
      description="Sign in with your authorized admin mobile number — we'll text you a one-time code."
      successRedirectTo="/admin-super/dashboard"
    />
  );
}
