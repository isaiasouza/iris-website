import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? "all";
  const plan = searchParams.get("plan") ?? "all";
  const q = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = 25;
  const offset = (page - 1) * perPage;

  let query = supabaseAdmin
    .from("licenses")
    .select("id,license_key,name,email,plan,status,max_devices,expires_at,created_at,cakto_transaction_id,abacatepay_checkout_id,internal_note", { count: "exact" });

  if (status !== "all") query = query.eq("status", status);
  if (plan !== "all") query = query.eq("plan", plan);
  if (q) {
    query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%,license_key.ilike.%${q}%`);
  }

  query = query.order("created_at", { ascending: false }).range(offset, offset + perPage - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch device counts
  const ids = (data ?? []).map((l) => l.id);
  let deviceCounts: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: devices } = await supabaseAdmin
      .from("devices")
      .select("license_id")
      .in("license_id", ids)
      .eq("is_active", true);
    for (const d of devices ?? []) {
      deviceCounts[d.license_id] = (deviceCounts[d.license_id] ?? 0) + 1;
    }
  }

  const licenses = (data ?? []).map((l) => ({
    ...l,
    devices_used: deviceCounts[l.id] ?? 0,
  }));

  return NextResponse.json({
    licenses,
    total: count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((count ?? 0) / perPage),
  });
}
