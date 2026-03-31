import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; deviceId: string }> }
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  const { id, deviceId } = await params;

  await supabaseAdmin
    .from("license_devices")
    .update({ is_active: false })
    .eq("id", deviceId)
    .eq("license_id", id);

  await supabaseAdmin.from("license_events").insert({
    license_id: id,
    event: "device_removed_by_admin",
    metadata: { device_id: deviceId },
  }).then(() => {});

  return NextResponse.json({ ok: true });
}
