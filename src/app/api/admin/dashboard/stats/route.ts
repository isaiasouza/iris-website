import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalActive },
    { count: totalAnnual },
    { count: totalLifetime },
    { count: totalSuspended },
    { count: totalCancelled },
    { count: newToday },
    { count: newThisWeek },
    { count: newThisMonth },
    { data: recentLicenses },
    { data: chartRaw },
  ] = await Promise.all([
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).eq("status", "active").eq("plan", "annual"),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).eq("status", "active").eq("plan", "lifetime"),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).eq("status", "suspended"),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).gte("created_at", weekStart),
    supabaseAdmin.from("licenses").select("*", { count: "exact", head: true }).gte("created_at", monthStart),
    supabaseAdmin.from("licenses").select("license_key,name,email,plan,status,created_at").order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("licenses").select("created_at,plan").gte("created_at", thirtyDaysAgo).order("created_at", { ascending: true }),
  ]);

  // Build chart data: group by day
  const dayMap: Record<string, { annual: number; lifetime: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = { annual: 0, lifetime: 0 };
  }
  for (const row of chartRaw ?? []) {
    const key = (row.created_at as string).slice(0, 10);
    if (dayMap[key]) {
      if (row.plan === "annual") dayMap[key].annual++;
      else dayMap[key].lifetime++;
    }
  }
  const chartData = Object.entries(dayMap).map(([day, v]) => ({ day, ...v }));

  const estimatedRevenue =
    (totalAnnual ?? 0) * 49.9 + (totalLifetime ?? 0) * 110.99;

  return NextResponse.json({
    totalActive: totalActive ?? 0,
    totalAnnual: totalAnnual ?? 0,
    totalLifetime: totalLifetime ?? 0,
    totalSuspended: totalSuspended ?? 0,
    totalCancelled: totalCancelled ?? 0,
    newToday: newToday ?? 0,
    newThisWeek: newThisWeek ?? 0,
    newThisMonth: newThisMonth ?? 0,
    estimatedRevenue,
    recentLicenses: recentLicenses ?? [],
    chartData,
  });
}
