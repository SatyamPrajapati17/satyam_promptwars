import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv, isConfigured } from "../env";

export async function createClient() {
  const cookieStore = await cookies();

  if (!isConfigured("supabase")) {
    return createServerClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored when called from Server Component
            }
          },
        },
      }
    );
  }

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored when called from Server Component
          }
        },
      },
    }
  );
}

export { createClient as createServerClient };
