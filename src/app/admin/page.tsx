"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "./_components/StatCard";
import LicenseStatusBadge from "./_components/LicenseStatusBadge";
import PlanBadge from "./_components/PlanBadge";
import MiniBarChart from "./_components/MiniBarChart";

interface Stats {
  totalActive: number;
  totalAnnual: number;
  totalLifetime: number;
  totalSuspended: number;
  totalCancelled: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
  estimatedRevenue: number;
  recentLicenses: Array<{
    license_key: string;
    name: string | null;
    email: string;
    plan: string;
    status: string;
    created_at: string;
  }>;
  chartData: Array<{ day: string; annual: number; lifetime: number }>;
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center text-[#9F9FA3]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/emitir"
          className="rounded-lg bg-iris-700/20 border border-iris-500/30 px-4 py-2 text-sm font-medium text-iris-300 hover:bg-iris-700/30 transition-colors"
        >
          + Emitir licença
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Licenças ativas" value={stats.totalActive} color="green" />
        <StatCard label="Receita estimada" value={`R$ ${stats.estimatedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} color="iris" />
        <StatCard label="Novas hoje" value={stats.newToday} />
        <StatCard label="Novas este mês" value={stats.newThisMonth} />
        <StatCard label="Plano anual" value={stats.totalAnnual} sub="ativas" />
        <StatCard label="Plano vitalício" value={stats.totalLifetime} sub="ativas" color="amber" />
        <StatCard label="Suspensas" value={stats.totalSuspended} color="amber" />
        <StatCard label="Canceladas" value={stats.totalCancelled} color="red" />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Novas licenças — últimos 30 dias</h2>
        <MiniBarChart data={stats.chartData} />
      </div>

      {/* Recent licenses */}
      <div className="rounded-xl border border-white/5 bg-[#19191E]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Licenças recentes</h2>
          <Link href="/admin/licencas" className="text-xs text-iris-400 hover:text-iris-300">
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Plano</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentLicenses.map((l) => (
                <tr key={l.license_key} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm text-white">{l.name ?? "—"}</p>
                    <p className="text-xs text-[#9F9FA3]">{l.email}</p>
                  </td>
                  <td className="px-5 py-3"><PlanBadge plan={l.plan} /></td>
                  <td className="px-5 py-3"><LicenseStatusBadge status={l.status} /></td>
                  <td className="px-5 py-3 text-xs text-[#9F9FA3]">{fmt(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
