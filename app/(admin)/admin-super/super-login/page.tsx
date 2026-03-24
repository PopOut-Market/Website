import { AdminLoginForm } from "@/components/admin-login-form";

export default function SuperUserLoginPage() {
  return (
    <AdminLoginForm
      title="Super Login"
      description="Use your super account for investor-grade oversight of live user data movement."
      showSignInButton={false}
    />
  );
}
