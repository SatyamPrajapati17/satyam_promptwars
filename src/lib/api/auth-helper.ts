import { createServerClient } from "@/lib/supabase/server";

export async function getAuthUser(): Promise<{ id: string; email: string }> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return { id: user.id, email: user.email || "user@example.com" };
    }
  } catch (e) {}

  // Fallback for local development if auth cookie is missing
  return { id: "local-user", email: process.env.ADMIN_EMAIL || "satyam@example.com" };
}
