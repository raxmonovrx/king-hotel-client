import {
  CalendarDays,
  Check,
  Clock,
  Phone,
  Send,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useOwnerRequestsQuery,
  useOwnerUpdateStatusMutation,
} from "@/features/requests/api/request.service";
import { cn } from "@/lib/utils";
import type { OwnerRequestItem, RequestStatus } from "@/types/api";

/* ================= helpers ================= */
const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
};

const fmtDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const fmtMoney = (n?: number | null) =>
  typeof n === "number" ? new Intl.NumberFormat("ru-RU").format(n) : "—";

const statusLabel = (s?: RequestStatus | null) => {
  switch (s) {
    case "new":
      return "Новая";
    case "accepted":
      return "Принята";
    case "rejected":
      return "Отклонена";
    default:
      return s ?? "—";
  }
};

const statusBadgeClass = (s?: RequestStatus | null) => {
  switch (s) {
    case "new":
      return "border-violet-500/25 bg-violet-500/10 text-violet-200";
    case "accepted":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "rejected":
      return "border-rose-500/25 bg-rose-500/10 text-rose-200";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
};

/* ================= component ================= */
export default function OwnerDashboard() {
  const { data, isLoading, isFetching, refetch } = useOwnerRequestsQuery();

  const [updateStatus, upd] = useOwnerUpdateStatusMutation();

  const items: OwnerRequestItem[] = data?.data?.requests ?? [];

  const total = data?.data?.totalCount ?? 0;

  const handleUpdate = async (id: string, status: "accepted" | "rejected") => {
    const t = toast.loading("Обновляем статус...");
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Статус обновлен", { id: t });
    } catch {
      toast.error("Ошибка обновления", { id: t });
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)]" />

      {/* HEADER */}
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Owner Dashboard</h1>

        <div className="flex items-center gap-3 text-sm text-white/50">
          <span>Всего заявок: {total}</span>
          <Button
            variant="outline"
            className="h-8 border-white/10 bg-transparent text-white hover:bg-white/5"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Обновить
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-6 text-white/60">
          Загружаем заявки...
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f18] py-14 text-white/50">
          <div className="text-4xl">📭</div>
          <p>Заявок пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <Card
              key={r.id}
              className="relative overflow-hidden rounded-2xl border-white/10 bg-linear-to-b from-[#0f0f18] to-[#0b0b12]"
            >
              <CardContent className="relative space-y-3 py-4">
                {/* TOP */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-base font-semibold text-white">
                        {r.destination}
                      </div>

                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                          statusBadgeClass(r.status)
                        )}
                      >
                        {statusLabel(r.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {r.guests} гостей
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Wallet className="h-4 w-4" />
                        {fmtMoney(r.budget_per_night)} {r.currency}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-white/40">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {fmtDateTime(r.created_at)}
                    </span>
                  </div>
                </div>

                {/* WISHES */}
                {r.wishes ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                    <div className="mb-1 text-xs text-white/50">Пожелания</div>
                    <div className="line-clamp-3">{r.wishes}</div>
                  </div>
                ) : null}

                {/* CONTACTS + ACTIONS */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                      {r.contact_name}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                      <Phone className="h-4 w-4" />
                      {r.phone}
                    </span>

                    {r.telegram ? (
                      <a
                        href={`https://t.me/${r.telegram.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
                      >
                        <Send className="h-4 w-4" />
                        {r.telegram}
                      </a>
                    ) : null}
                  </div>

                  {r.status === "new" ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-500 text-black hover:bg-emerald-400"
                        disabled={upd.isLoading}
                        onClick={() => handleUpdate(r.id, "accepted")}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Принять
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                        disabled={upd.isLoading}
                        onClick={() => handleUpdate(r.id, "rejected")}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Отклонить
                      </Button>
                    </div>
                  ) : null}
                </div>

                {/* USER EMAIL */}
                <div className="text-xs text-white/40">
                  Пользователь: {r.user_email}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
