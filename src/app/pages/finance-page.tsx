import { useMemo, useState } from "react";
import { invoiceHistory, manualApprovals } from "../../mocks/dashboard-features.mock";

type InvoiceStatusFilter = "ALL" | "Paid" | "Pending" | "Rejected";

type InvoiceRecord = (typeof invoiceHistory)[number] | (typeof invoiceHistory)[number] & { status: "Rejected" };

export function FinancePage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(invoiceHistory);
  const [approvals, setApprovals] = useState(manualApprovals);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("ALL");
  const [query, setQuery] = useState("");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const passStatus = statusFilter === "ALL" || invoice.status === statusFilter;
      const passQuery =
        query.trim().length === 0 ||
        `${invoice.invoice} ${invoice.user} ${invoice.method}`.toLowerCase().includes(query.toLowerCase());
      return passStatus && passQuery;
    });
  }, [invoices, query, statusFilter]);

  const paidCount = invoices.filter((invoice) => invoice.status === "Paid").length;
  const pendingCount = invoices.filter((invoice) => invoice.status === "Pending").length;
  const rejectedCount = invoices.filter((invoice) => invoice.status === "Rejected").length;

  const handleDecision = (requestId: string, decision: "Approve" | "Reject") => {
    const target = approvals.find((approval) => approval.requestId === requestId);
    if (!target) return;

    setApprovals((prev) => prev.filter((approval) => approval.requestId !== requestId));
    setInvoices((prev) => [
      {
        invoice: `INV-MANUAL-${target.requestId}`,
        user: target.user,
        amount: target.amount,
        method: "Bank Transfer",
        status: decision === "Approve" ? "Paid" : "Rejected",
        date: target.submittedAt.slice(0, 10),
      },
      ...prev,
    ]);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="mt-2 text-sm text-muted-foreground">Invoice history and manual transfer approvals panel.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Paid Invoices</p>
          <p className="mt-3 text-2xl font-bold">{paidCount}</p>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Pending Invoices</p>
          <p className="mt-3 text-2xl font-bold">{pendingCount}</p>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Rejected Invoices</p>
          <p className="mt-3 text-2xl font-bold">{rejectedCount}</p>
        </article>
      </div>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Invoice History</h2>
            <p className="text-sm text-muted-foreground">Mock records for billing and payment verification flow.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search invoice/user..."
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as InvoiceStatusFilter)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground font-medium">
                <th className="pb-2">Invoice</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={`${invoice.invoice}-${invoice.date}`} className="border-b border-border/70 last:border-none">
                  <td className="py-3 font-medium">{invoice.invoice}</td>
                  <td className="py-3">{invoice.user}</td>
                  <td className="py-3">{invoice.amount}</td>
                  <td className="py-3">{invoice.method}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        invoice.status === "Paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                          : invoice.status === "Pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3">{invoice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Manual Approvals</h2>
        <p className="text-sm text-muted-foreground">Transfer-based payments awaiting admin verification.</p>
        <div className="mt-4 grid gap-3">
          {approvals.map((approval) => (
            <div
              key={approval.requestId}
              className="flex flex-col gap-3 rounded-lg bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {approval.requestId} - {approval.user}
                </p>
                <p className="text-xs text-muted-foreground">
                  {approval.bankRef} - Submitted {approval.submittedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{approval.amount}</span>
                <button
                  type="button"
                  onClick={() => handleDecision(approval.requestId, "Approve")}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(approval.requestId, "Reject")}
                  className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
        {approvals.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">No pending manual approvals.</p>
        ) : null}
      </article>
    </section>
  );
}
