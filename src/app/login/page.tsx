"use client";

import { useActionState, useRef, useState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, action] = useActionState(loginAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 50% 40%, #0d1117 0%, #010409 100%)" }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo + Brand */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 0 50px rgba(34, 197, 94, 0.3)",
            }}
          >
            <span className="text-white text-2xl font-bold tracking-tight">CL</span>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{
              background: "linear-gradient(135deg, #f0fdf4, #86efac, #22c55e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Architect Mapper
          </h1>
          <p className="text-sm" style={{ color: "var(--foreground-dim)" }}>
            Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <form
          ref={formRef}
          action={action}
          onSubmit={() => setLoading(true)}
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          {state?.error && (
            <div
              className="text-sm rounded-lg px-3 py-2"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
                color: "#f87171",
              }}
            >
              {state.error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email" name="email" type="email" required
              className="input-field" placeholder="admin@cortexlab.dev"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password" name="password" type="password" required
              className="input-field" placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[11px] mt-6" style={{ color: "var(--foreground-dim)" }}>
          Default: admin@cortexlab.dev / admin123
        </p>
      </div>
    </div>
  );
}
