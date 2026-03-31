"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push(from);
    } else {
      setError("Email ou senha incorretos.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#13131A] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Image src="/logo-web.png" alt="Iris Downloader" width={40} height={40} className="rounded-xl" />
          <span className="text-lg font-bold text-white">Admin</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/8 bg-[#19191E] p-8"
        >
          <h1 className="mb-6 text-xl font-bold text-white">Entrar</h1>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-[#9F9FA3]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-[#13131A] px-4 py-2.5 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/50 focus:ring-1 focus:ring-iris-500/25"
                placeholder="admin@irisdownloader.com.br"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-[#9F9FA3]">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-[#13131A] px-4 py-2.5 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/50 focus:ring-1 focus:ring-iris-500/25"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-iris-700 to-iris-500 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
