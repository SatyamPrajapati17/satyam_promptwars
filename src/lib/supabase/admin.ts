import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv, isConfigured } from "../env";

export function createAdminClient() {
  if (!isConfigured("supabase")) {
    return createSupabaseClient(
      "https://placeholder.supabase.co",
      "placeholder-secret-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  return createSupabaseClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

