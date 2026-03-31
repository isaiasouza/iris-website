import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  let body: { ids: string[]; action: "suspend" | "cancel" };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.ids?.length || !body.action) {
    return NextResponse.json({ error: "ids e action são obrigatórios" }, { status: 400 });
  }

  const status = body.action === "suspend" ? "suspended" : "cancelled";

  const { count, error } = await supabaseAdmin
    .from("licenses")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", body.ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, updated: count ?? body.ids.length });
}
