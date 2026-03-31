import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  const { id } = await params;

  const [{ data: license, error }, { data: devices }, { data: events }] = await Promise.all([
    supabaseAdmin.from("licenses").select("*").eq("id", id).single(),
    supabaseAdmin.from("license_devices").select("*").eq("license_id", id).order("activated_at", { ascending: false }),
    supabaseAdmin.from("license_events").select("*").eq("license_id", id).order("created_at", { ascending: false }).limit(50),
  ]);

  if (error || !license) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ license, devices: devices ?? [], events: events ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  const { id } = await params;

  let body: { status?: string; internal_note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status) updates.status = body.status;
  if (typeof body.internal_note !== "undefined") updates.internal_note = body.internal_note;

  const { error } = await supabaseAdmin.from("licenses").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Record event if status changed
  if (body.status) {
    await supabaseAdmin.from("license_events").insert({
      license_id: id,
      event: "admin_status_change",
      metadata: { to: body.status, by: "admin" },
    }).then(() => {});
  }

  return NextResponse.json({ ok: true });
}
