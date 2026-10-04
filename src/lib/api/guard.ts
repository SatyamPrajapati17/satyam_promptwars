import { createClient } from "@/lib/supabase/server";
import { ApiError } from "./errors";
import { isConfigured } from "@/lib/env";

export async function requireUser() {
  if (!isConfigured("supabase")) {
    throw new ApiError(
      "integration_not_configured",
      "Supabase is not configured. Please complete setup.",
      503
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new ApiError("unauthenticated", "Authentication required", 401);
  }

  return { user: data.user, supabase };
}

export function checkCsrf(request: Request) {
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          throw new ApiError("forbidden", "Cross-origin request rejected", 403);
        }
      } catch {
        throw new ApiError("forbidden", "Invalid origin header", 403);
      }
    }
  }
}
