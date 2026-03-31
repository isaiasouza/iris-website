import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  const { id } = await params;

  await Promise.all([
    supabaseAdmin.from("licenses").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", id),
    supabaseAdmin.from("license_devices").update({ is_active: false }).eq("license_id", id),
  ]);

  await supabaseAdmin.from("license_events").insert({
    license_id: id,
    event: "revoked_by_admin",
    metadata: { by: "admin" },
  }).then(() => {});

  return NextResponse.json({ ok: true });
}
