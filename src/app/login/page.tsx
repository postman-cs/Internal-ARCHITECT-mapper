import { getUsers, loginAsUserAction } from "@/lib/actions/auth";

export default async function LoginPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 50% 40%, #0d1117 0%, #010409 100%)" }} />

      <div className="relative z-10 w-full max-w-sm">
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
            Select your account to continue
          </p>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <form key={user.id} action={async () => {
              "use server";
              await loginAsUserAction(user.id);
            }}>
              <button
                type="submit"
                className="w-full flex items-center gap-4 rounded-2xl p-4 transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                }}
                onMouseOver={undefined}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #22c55e20, #16a34a20)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    color: "#86efac",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{user.name}</p>
                  <p className="text-xs" style={{ color: "var(--foreground-dim)" }}>{user.email}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                  background: user.role === "ADMIN" ? "rgba(139,92,246,0.1)" : "rgba(6,214,214,0.1)",
                  color: user.role === "ADMIN" ? "#c4b5fd" : "#67e8f9",
                  border: `1px solid ${user.role === "ADMIN" ? "rgba(139,92,246,0.2)" : "rgba(6,214,214,0.2)"}`,
                }}>
                  {user.role}
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
