import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = req.nextUrl;
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  const status = searchParams.get("status") ?? "all";
  const plan = searchParams.get("plan") ?? "all";
  const q = searchParams.get("q") ?? "";

  let query = supabaseAdmin
    .from("licenses")
    .select("id,license_key,name,email,plan,status,max_devices,created_at,expires_at");

  if (ids.length > 0) {
    query = query.in("id", ids);
  } else {
    if (status !== "all") query = query.eq("status", status);
    if (plan !== "all") query = query.eq("plan", plan);
    if (q) query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%,license_key.ilike.%${q}%`);
  }

  query = query.order("created_at", { ascending: false }).limit(5000);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch device counts
  const licenseIds = (data ?? []).map((l) => l.id);
  let deviceCounts: Record<string, number> = {};
  if (licenseIds.length > 0) {
    const { data: devices } = await supabaseAdmin
      .from("license_devices")
      .select("license_id")
      .in("license_id", licenseIds)
      .eq("is_active", true);
    for (const d of devices ?? []) {
      deviceCounts[d.license_id] = (deviceCounts[d.license_id] ?? 0) + 1;
    }
  }

  const header = "id,license_key,name,email,plan,status,max_devices,created_at,expires_at,devices_used\n";
  const rows = (data ?? []).map((l) => {
    const esc = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    return [
      esc(l.id),
      esc(l.license_key),
      esc(l.name),
      esc(l.email),
      esc(l.plan),
      esc(l.status),
      l.max_devices,
      esc(l.created_at),
      esc(l.expires_at),
      deviceCounts[l.id] ?? 0,
    ].join(",");
  });

  const csv = "\uFEFF" + header + rows.join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="licencas-${date}.csv"`,
    },
  });
}
