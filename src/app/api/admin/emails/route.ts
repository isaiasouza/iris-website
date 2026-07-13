import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status") ?? "all";
  const type = searchParams.get("type") ?? "all";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 30;
  const offset = (page - 1) * perPage;

  let query = supabaseAdmin
    .from("email_events")
    .select("id,to_email,subject,type,status,provider,provider_id,error_message,metadata,created_at", { count: "exact" });

  if (q) query = query.or(`to_email.ilike.%${q}%,subject.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);
  if (type !== "all") query = query.eq("type", type);

  query = query.order("created_at", { ascending: false }).range(offset, offset + perPage - 1);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    emails: data ?? [],
    total: count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((count ?? 0) / perPage),
  });
}
