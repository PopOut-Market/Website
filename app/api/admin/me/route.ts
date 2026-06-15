import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/** Membership probe used by the client AdminAuthGuard to confirm the signed-in
 *  user is an allowlisted admin (server-validated). Returns 401/403 otherwise. */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;
  return NextResponse.json({ email: gate.email });
}
