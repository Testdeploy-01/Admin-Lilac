import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LogIn, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";

// ─── Auth config placeholder ────────────────────────────────────────────────
// TODO: Replace this mock with a real auth call (e.g. Supabase, REST API, etc.)
async function mockSignIn(email: string, password: string): Promise<void> {
  await new Promise((res) => setTimeout(res, 900));
  if (!email.trim() || !password.trim()) {
    throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
  }
}
// ────────────────────────────────────────────────────────────────────────────

const THEME_KEY = "mockup-theme";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// ── Animated particles for AI vibe ──
// Pre-compute particle data outside the component to avoid impure Math.random() during render
const PARTICLE_DATA = Array.from({ length: 18 }, (_, i) => {
  const seed = (i + 1) * 7;
  const pseudo = (n: number) => ((Math.sin(seed * n) * 10000) % 1 + 1) % 1;
  return {
    width: pseudo(1) * 4 + 2,
    height: pseudo(2) * 4 + 2,
    left: `${pseudo(3) * 100}%`,
    top: `${pseudo(4) * 100}%`,
    yOffset: -(pseudo(5) * 80 + 30),
    duration: pseudo(6) * 4 + 3,
    delay: pseudo(7) * 3,
  };
});

function AiParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLE_DATA.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, p.yOffset],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme toggle (same logic as DashboardLayout)
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await mockSignIn(email, password);
      // Ensure the skeleton shows up the next time we visit overview
      sessionStorage.removeItem("hasVisitedOverview");
      navigate("/overview", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* BackgroundBeams (Aceternity UI) */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <BackgroundBeams />
      </div>
      <AiParticles />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 50%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Theme toggle button ── */}
      <motion.button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/70 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-primary/10"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-[18px] w-[18px] text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-[18px] w-[18px] text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ═══════════════ Centered Card ═══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] px-5"
      >
        <div className="relative rounded-2xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
          {/* Top accent line */}
          <div className="absolute left-1/2 top-0 h-[2px] w-24 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="px-8 pb-8 pt-10">
            {/* ── Logo + Title ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-8 flex flex-col items-center gap-4"
            >
              {/* Logo with glow ring */}
              <div className="relative">
                <div
                  className="absolute inset-0 scale-150 rounded-full opacity-20 blur-2xl"
                  style={{ background: "hsl(var(--primary))" }}
                />
                <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-br from-card to-background shadow-lg">
                  <img
                    src="/Logo.png"
                    alt="Lilac Admin Logo"
                    className="h-12 w-12 object-contain drop-shadow-md"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Lilac{" "}
                  <span className="bg-gradient-to-r from-primary to-[hsl(280_45%_60%)] bg-clip-text text-transparent">
                    Admin
                  </span>
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  เข้าสู่ระบบเพื่อจัดการแดชบอร์ด
                </p>
              </div>
            </motion.div>

            {/* ── Form ── */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-foreground/80"
                >
                  อีเมล
                </label>
                <div className="group relative">
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@lilac.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11 rounded-xl border-border/50 bg-background/50 pl-4 text-sm transition-all duration-200 placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-foreground/80"
                >
                  รหัสผ่าน
                </label>
                <div className="group relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 rounded-xl border-border/50 bg-background/50 pl-4 pr-11 text-sm transition-all duration-200 placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-muted-foreground/60 transition-colors hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-2.5 text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                id="login-submit"
                type="submit"
                disabled={loading}
                className={cn(
                  "h-11 w-full rounded-xl bg-gradient-to-r from-primary to-[hsl(280_40%_58%)] font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110",
                  loading && "cursor-not-allowed opacity-80"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังเข้าสู่ระบบ…
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    เข้าสู่ระบบ
                  </>
                )}
              </Button>
            </motion.form>
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground/60"
        >
          สำหรับผู้ดูแลระบบเท่านั้น · Powered by{" "}
          <span className="font-medium text-primary/70">Lilac AI</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
