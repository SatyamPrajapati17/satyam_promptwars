import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
