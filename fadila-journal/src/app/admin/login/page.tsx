
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Giriş mümkün olmadı.");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Serverə qoşulmaq mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-10 text-[#24241f]">
      <div className="w-full max-w-md">
        <a href="/" className="text-sm text-gray-500">
          ← Sayta qayıt
        </a>

        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            FADILA JOURNAL
          </p>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Admin paneli
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Bloqlarını idarə etmək üçün daxil ol.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                E-poçt
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Şifrə
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrən"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#24241f] px-4 py-3 font-medium text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? "Yoxlanılır..." : "Daxil ol"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">
          Fadila Journal · Admin giriş
        </p>
      </div>
    </main>
  );
}
