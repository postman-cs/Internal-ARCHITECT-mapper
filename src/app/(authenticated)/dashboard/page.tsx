import Link from "next/link";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Dashboard — Architect Mapper",
};

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.2)",
              }}
            >
              <span className="text-white text-sm font-bold">CL</span>
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #f0fdf4, #86efac, #22c55e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Architect Mapper
              </h1>
              <p className="text-xs" style={{ color: "var(--foreground-dim)" }}>
                Welcome back, {session.name || session.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/architect" className="card-glow block group">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255, 108, 55, 0.1)", border: "1px solid rgba(255, 108, 55, 0.2)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FF6C37" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Architecture Mapper
                </h3>
                <p className="text-xs" style={{ color: "var(--foreground-dim)" }}>
                  Map customer infrastructure and services
                </p>
              </div>
            </div>
          </Link>

          <form action={async () => { "use server"; const { logoutAction } = await import("@/lib/actions/auth"); await logoutAction(); }}>
            <button
              type="submit"
              className="card w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Sign Out
                  </h3>
                  <p className="text-xs" style={{ color: "var(--foreground-dim)" }}>
                    End your session
                  </p>
                </div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
