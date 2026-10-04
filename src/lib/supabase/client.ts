import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "../env";

export function createClient() {
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key"
    );
  }
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

