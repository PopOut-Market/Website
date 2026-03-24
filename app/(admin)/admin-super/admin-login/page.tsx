import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminUserLoginPage() {
  return (
    <AdminLoginForm
      title="Admin Login"
      description="Use your internal admin account to manage users, data, and reports."
      successRedirectTo="/admin-super/dashboard"
    />
  );
}
