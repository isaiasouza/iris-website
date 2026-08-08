import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() ?? "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("licenses")
    .select("id,license_key,plan,status,created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) return NextResponse.json({ error: "Não foi possível verificar licenças existentes." }, { status: 500 });
  return NextResponse.json({ licenses: data ?? [] });
}
