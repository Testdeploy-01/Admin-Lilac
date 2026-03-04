import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { managedUsers, PLAN_LABELS, type PlanKey } from "../../mocks/dashboard-features.mock";
import { formatCurrencyTHB, formatNumber } from "../../lib/formatters";

type UserFilter = "all" | "plus" | "free" | "suspended" | "new7";
type SortMode = "signup-desc" | "signup-asc" | "token-desc" | "token-asc";

const filterButtons: Array<{ key: UserFilter; label: string }> = [
  { key: "all", label: "ทั้งหมด" },
  { key: "plus", label: "Plus+" },
  { key: "free", label: "FREE" },
  { key: "suspended", label: "Suspended" },
  { key: "new7", label: "ใหม่ 7 วัน" },
];

function within7Days(dateText: string) {
  const signup = new Date(`${dateText}T00:00:00`);
  const now = new Date();
  const diff = now.getTime() - signup.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 7;
}

export function UserManagementPage() {
  const location = useLocation();
  const initialUserId = new URLSearchParams(location.search).get("user") ?? "";
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const [rows, setRows] = useState(managedUsers);
  const [filter, setFilter] = useState<UserFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("signup-desc");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId);
  const [drawerOpen, setDrawerOpen] = useState(Boolean(initialUserId));

  const pageSize = 15;

  const filtered = useMemo(() => {
    const next = rows.filter((row) => {
      if (filter === "all") return true;
      if (filter === "plus") return row.plan !== "FREE";
      if (filter === "free") return row.plan === "FREE";
      if (filter === "suspended") return row.status === "suspended";
      return within7Days(row.signupDate) || row.status === "new";
    });

    next.sort((a, b) => {
      const aTotal = a.inputVoiceTokens + a.inputTextTokens + a.outputTextTokens;
      const bTotal = b.inputVoiceTokens + b.inputTextTokens + b.outputTextTokens;
      if (sortMode === "token-desc") return bTotal - aTotal;
      if (sortMode === "token-asc") return aTotal - bTotal;
      const aDate = new Date(`${a.signupDate}T00:00:00`).getTime();
      const bDate = new Date(`${b.signupDate}T00:00:00`).getTime();
      if (sortMode === "signup-asc") return aDate - bDate;
      return bDate - aDate;
    });

    return next;
  }, [filter, rows, sortMode]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const selectedUser = rows.find((row) => row.id === selectedUserId);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const dialog = drawerRef.current;
    if (!dialog) {
      return;
    }

    const selectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(selectors));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [drawerOpen]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">ผู้ใช้งาน</h2>
        <p className="mt-1 text-sm text-muted-foreground">ศูนย์จัดการบัญชีผู้ใช้ พร้อมตัวกรองขั้นสูงและแผงรายละเอียด</p>
      </header>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filterButtons.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setFilter(option.key);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filter === option.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <select
              value={sortMode}
              onChange={(event) => {
                setSortMode(event.target.value as SortMode);
                setPage(1);
              }}
              aria-label="เรียงลำดับผู้ใช้งาน"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="signup-desc">สมัครล่าสุด → เก่าสุด</option>
              <option value="signup-asc">สมัครเก่าสุด → ล่าสุด</option>
              <option value="token-desc">Token มาก → น้อย</option>
              <option value="token-asc">Token น้อย → มาก</option>
            </select>
            <p className="rounded-md border border-input bg-background px-3 py-2 text-xs text-muted-foreground">
              ทั้งหมด {filtered.length} รายการ
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <caption className="sr-only">ตารางผู้ใช้งานพร้อมข้อมูลแพลน การใช้โทเคน และสถานะ</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="pb-2">ผู้ใช้</th>
                <th scope="col" className="pb-2">แพลน</th>
                <th scope="col" className="pb-2">วันสมัคร</th>
                <th scope="col" className="pb-2">หมวดที่สนใจ</th>
                <th scope="col" className="pb-2">Alert</th>
                <th scope="col" className="pb-2">Total Tokens (เดือน)</th>
                <th scope="col" className="pb-2">Breakdown (Voice / Text In / Text Out)</th>
                <th scope="col" className="pb-2">ต้นทุน AI</th>
                <th scope="col" className="pb-2">สถานะ</th>
                <th scope="col" className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    ไม่พบผู้ใช้ตามตัวกรองที่เลือก
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="border-b border-border/70 last:border-none">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full border border-border object-cover" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{PLAN_LABELS[user.plan]}</td>
                    <td className="py-3">{user.signupDate}</td>
                    <td className="py-3">{user.favoriteCategory}</td>
                    <td className="py-3">{user.systemAlert}</td>
                    <td className="py-3">{formatNumber(user.inputVoiceTokens + user.inputTextTokens + user.outputTextTokens)}</td>
                    <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatNumber(user.inputVoiceTokens)} / {formatNumber(user.inputTextTokens)} / {formatNumber(user.outputTextTokens)}
                    </td>
                    <td className="py-3">{formatCurrencyTHB(user.aiCostTHB)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                          : user.status === "suspended"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          lastFocusedRef.current = event.currentTarget;
                          setSelectedUserId(user.id);
                          setDrawerOpen(true);
                        }}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-accent"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            หน้า {safePage} / {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-md border border-input px-2 py-1 disabled:opacity-50"
            >
              ก่อนหน้า
            </button>
            <button
              type="button"
              disabled={safePage === pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              className="rounded-md border border-input px-2 py-1 disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </article>

      {drawerOpen && selectedUser ? (
        <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setDrawerOpen(false)}>
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-detail-title"
            tabIndex={-1}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 id="user-detail-title" className="text-base font-semibold">รายละเอียดผู้ใช้</h3>
              <button type="button" aria-label="ปิดรายละเอียดผู้ใช้" onClick={() => setDrawerOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                ปิด
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-card p-4">
              <div className="flex items-center gap-3">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="h-12 w-12 rounded-full border border-border" />
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.id}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p>แพลนปัจจุบัน: {PLAN_LABELS[selectedUser.plan]}</p>
                <p>Login ล่าสุด: {selectedUser.lastLogin}</p>
                <p>โควตาคงเหลือ (ประมาณ): {Math.max(0, 100 - Math.floor((selectedUser.inputVoiceTokens + selectedUser.inputTextTokens + selectedUser.outputTextTokens) / 500))}%</p>
                <p>Voice Input: {formatNumber(selectedUser.inputVoiceTokens)} tokens <span className="text-muted-foreground ml-1">({formatCurrencyTHB((selectedUser.inputVoiceTokens / 0.35) * 0.0045 * 0.35)} โดยประมาณ)</span></p>
                <p>Text Input: {formatNumber(selectedUser.inputTextTokens)} tokens <span className="text-muted-foreground ml-1">({formatCurrencyTHB((selectedUser.inputTextTokens / 0.25) * 0.0045 * 0.25)} โดยประมาณ)</span></p>
                <p>Text Output: {formatNumber(selectedUser.outputTextTokens)} tokens <span className="text-muted-foreground ml-1">({formatCurrencyTHB((selectedUser.outputTextTokens / 0.40) * 0.0045 * 0.40)} โดยประมาณ)</span></p>
                <p>Alert: {selectedUser.systemAlert}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-sm">
                <span className="text-muted-foreground">เปลี่ยนแพลน</span>
                <select
                  value={selectedUser.plan}
                  onChange={(event) =>
                    setRows((prev) =>
                      prev.map((row) =>
                        row.id === selectedUser.id ? { ...row, plan: event.target.value as PlanKey } : row,
                      ),
                    )
                  }
                  aria-label="แก้ไขแพลนผู้ใช้งาน"
                  className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
                >
                  {(Object.entries(PLAN_LABELS) as Array<[PlanKey, string]>).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRows((prev) =>
                      prev.map((row) => (row.id === selectedUser.id ? { ...row, status: "suspended" } : row)),
                    )
                  }
                  className="rounded-md bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  ระงับบัญชี
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRows((prev) =>
                      prev.map((row) => (row.id === selectedUser.id ? { ...row, status: "active" } : row)),
                    )
                  }
                  className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  ปลดระงับ
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

