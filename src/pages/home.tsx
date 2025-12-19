// pages/Home.tsx
import {
  CalendarDays,
  Clock,
  LogOut,
  Phone,
  Send,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { selectUser } from "@/features/auth/api/auth.selectors";
import { useLogoutMutation } from "@/features/auth/api/auth.service";
import { clearUser } from "@/features/auth/api/auth.slice";
import { AuthModal } from "@/features/auth/components/AuthModal";
import {
  useCreateRequestMutation,
  useMyRequestsQuery,
} from "@/features/requests/api/request.service";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getMsg } from "@/lib/get-msg";
import { digitsOnly, groupThousands } from "@/lib/number-format";
import { cn } from "@/lib/utils";
import type { RequestCreateBody } from "@/types/api";
import { toast } from "sonner";

const EMPTY_FORM: RequestCreateBody = {
  destination: "",
  check_in: "",
  check_out: "",
  guests: 1,
  budget_per_night: 1,
  currency: "RUB",
  wishes: "",
  contact_name: "",
  phone: "",
  telegram: "",
};

function initialsFromEmail(email?: string) {
  if (!email) return "GU";
  const name = email.split("@")[0] || "GU";
  const a = (name[0] || "G").toUpperCase();
  const b = (name[1] || "U").toUpperCase();
  return a + b;
}

// --- helpers ---
const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
};

const fmtDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtMoney = (n?: number | null) => {
  if (typeof n !== "number") return "—";
  return new Intl.NumberFormat("ru-RU").format(n);
};

const statusLabel = (s?: string | null) => {
  switch (s) {
    case "new":
      return "Новая";
    case "approved":
      return "Принята";
    case "rejected":
      return "Отклонена";
    case "closed":
      return "Закрыта";
    default:
      return s ?? "—";
  }
};

const statusBadgeClass = (s?: string | null) => {
  switch (s) {
    case "new":
      return "border-violet-500/25 bg-violet-500/10 text-violet-200";
    case "approved":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "rejected":
      return "border-rose-500/25 bg-rose-500/10 text-rose-200";
    case "closed":
      return "border-white/10 bg-white/5 text-white/70";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
};
export default function Home() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [createRequest, createState] = useCreateRequestMutation();
  const [logout] = useLogoutMutation();
  const myReq = useMyRequestsQuery(undefined, { skip: !user });
  const items = myReq.data?.data ?? [];

  const [authOpen, setAuthOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const [form, setForm] = useState<RequestCreateBody>({
    destination: "",
    check_in: "",
    check_out: "",
    guests: 1,
    budget_per_night: 1,
    currency: "RUB",
    wishes: "",
    contact_name: "",
    phone: "",
    telegram: "",
  });

  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const [budgetRaw, setBudgetRaw] = useState("");
  const [budgetFocused, setBudgetFocused] = useState(false);

  const [guestsRaw, setGuestsRaw] = useState("");
  const [guestsFocused, setGuestsFocused] = useState(false);

  const [phoneInput, setPhoneInput] = useState("");
  const [telegramInput, setTelegramInput] = useState("");

  const set = <K extends keyof RequestCreateBody>(
    key: K,
    value: RequestCreateBody[K]
  ) => setForm((p) => ({ ...p, [key]: value }));

  const canSend = useMemo(() => {
    // minimal validation (xohlasangiz kuchaytirasiz)
    if (!form.destination.trim()) return false;
    if (!form.check_in) return false;
    if (!form.check_out) return false;
    if (!form.contact_name.trim()) return false;
    if (!form.phone.trim()) return false;
    return !createState.isLoading;
  }, [form, createState.isLoading]);

  const resetForm = () => {
    setForm(EMPTY_FORM);

    setCheckIn(undefined);
    setCheckOut(undefined);

    setBudgetRaw("");
    setBudgetFocused(false);

    setGuestsRaw("");
    setGuestsFocused(false);

    setPhoneInput("");
    setTelegramInput("");
  };

  const doCreate = async () => {
    const t = toast.loading("Отправляем заявку...");

    try {
      // unwrap -> success bo'lsa ApiResponse qaytadi, error bo'lsa throw qiladi
      const data = await createRequest(form).unwrap();

      toast.success(data?.message ?? "Заявка отправлена", { id: t });
      setPendingSubmit(false);
      resetForm();
    } catch (err) {
      // err RTK Query error bo'ladi (FetchBaseQueryError | SerializedError)
      toast.error(getMsg({ error: err }), { id: t });
    }
  };

  const handleSubmit = async () => {
    if (createState.isLoading) return;
    if (!canSend) return;

    if (!user) {
      setPendingSubmit(true);
      setAuthOpen(true);
      return;
    }

    await doCreate();
  };
  const onLogout = async () => {
    const t = toast.loading("Выходим...");

    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success("Вы вышли из аккаунта", { id: t });
    } catch (err) {
      toast.error(getMsg({ error: err }), { id: t });
    }
  };

  const handleAuthSuccess = async () => {
    if (pendingSubmit) {
      await doCreate();
    }
  };

  const myCount = myReq.data?.data?.length ?? 0;

  return (
    <Container className="animate__animated animate__fadeIn space-y-10">
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={handleAuthSuccess}
      />

      {/* USER CARD (login/register bo'lgandan keyin) */}
      {user ? (
        <Card className="relative overflow-hidden rounded-2xl border-white/10 bg-linear-to-b from-[#0f0f18] to-[#0b0b12]">
          {/* subtle glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.14),transparent_55%)]" />

          <CardContent className="relative flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white font-semibold ring-1 ring-white/10">
                  {initialsFromEmail(user.email)}
                </div>
                {/* online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0f0f18]" />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-medium leading-5">
                    {user.email}
                  </span>

                  {/* role badge */}
                  <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-200">
                    {user.role}
                  </span>
                </div>

                <div className="text-xs text-white/50">
                  Аккаунт активен • доступ к заявкам
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* optional: settings button */}
              {/* <Button
        variant="outline"
        className="border-white/10 bg-transparent text-white hover:bg-white/5"
      >
        Профиль
      </Button> */}

              <Button
                variant="outline"
                className="border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={onLogout} // <- sizning logout handler
              >
                <LogOut className="mr-2 h-4 w-4 opacity-80" />
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* REQUEST FORM */}
      <Card className="border-white/10 bg-linear-to-b from-[#0f0f18] to-[#0b0b12] rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_80px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)]" />

        <CardHeader className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Найдите идеальное жилье без поиска
          </h1>
          <p className="text-sm text-muted-foreground">
            Оставьте заявку — владельцы сами предложат вам лучшие варианты
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm text-white/80">
                Куда едете?
              </label>
              <Input
                placeholder="Сочи, Адлер, Геленджик..."
                value={form.destination}
                onChange={(e) => set("destination", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Заезд</label>
              <DatePicker
                placeholder="Дата заезда"
                value={checkIn}
                onChange={(d) => {
                  setCheckIn(d);
                  set("check_in", d ? d.toISOString().slice(0, 10) : "");
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Выезд</label>
              <DatePicker
                placeholder="Дата выезда"
                value={checkOut}
                onChange={(d) => {
                  setCheckOut(d);
                  set("check_out", d ? d.toISOString().slice(0, 10) : "");
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Гостей</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="10"
                value={guestsFocused ? guestsRaw : groupThousands(guestsRaw)}
                onFocus={() => setGuestsFocused(true)}
                onBlur={() => setGuestsFocused(false)}
                onChange={(e) => {
                  const raw = digitsOnly(e.target.value);
                  setGuestsRaw(raw);
                  set("guests", raw === "" ? 0 : Number(raw));
                }}
              />
            </div>
          </div>

          {/* BUDGET */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/80">
                Бюджет в сутки
              </label>

              <div className="flex gap-2">
                <Input
                  inputMode="numeric"
                  placeholder="3000"
                  value={budgetFocused ? budgetRaw : groupThousands(budgetRaw)}
                  onFocus={() => setBudgetFocused(true)}
                  onBlur={() => setBudgetFocused(false)}
                  onChange={(e) => {
                    const raw = digitsOnly(e.target.value);
                    setBudgetRaw(raw);
                    set("budget_per_night", raw === "" ? 0 : Number(raw));
                  }}
                />

                <Select
                  value={form.currency}
                  onValueChange={(v) => set("currency", v as "USD" | "RUB")}
                >
                  <SelectTrigger className="w-24 bg-[#0f0f18] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="bg-[#0f0f18] border-white/10">
                    <SelectItem value="RUB">₽ RUB</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* WISHES */}
          <div>
            <label className="mb-1 block text-sm text-white/80">
              Особые пожелания
            </label>
            <Textarea
              rows={3}
              value={form.wishes}
              onChange={(e) => set("wishes", e.target.value)}
              placeholder="1-я линия, вид на море, парковка, с животными..."
            />
          </div>

          {/* CONTACTS */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Ваши контакты для связи
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-white/80">Имя</label>
                <Input
                  placeholder="Ваше имя"
                  value={form.contact_name}
                  className="capitalize"
                  onChange={(e) => set("contact_name", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Телефон
                </label>
                <Input
                  placeholder="+998901234567"
                  value={phoneInput}
                  inputMode="numeric"
                  onChange={(e) => {
                    let v = e.target.value;
                    if (!v.startsWith("+")) v = "+" + v.replace(/\+/g, "");
                    const digits = v.slice(1).replace(/\D/g, "");
                    const next = "+" + digits;

                    setPhoneInput(next);
                    set("phone", next);
                  }}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Telegram
                </label>
                <Input
                  placeholder="@username"
                  value={telegramInput}
                  onChange={(e) => {
                    let v = e.target.value;
                    if (!v.startsWith("@")) v = "@" + v.replace(/@/g, "");
                    const username = v.slice(1).replace(/[^a-zA-Z0-9_]/g, "");
                    const next = "@" + username;

                    setTelegramInput(next);
                    set("telegram", next);
                  }}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div />
            <Button
              size="lg"
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400 md:w-auto"
              disabled={!canSend}
              onClick={handleSubmit}
            >
              <Send className="mr-2 h-4 w-4" />
              Оставить заявку
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MY REQUESTS */}

      <div className="mt-14">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-white">Мои заявки</h2>

          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>У вас {myCount} активных заявок</span>
            {user ? (
              <Button
                variant="outline"
                className="h-8 border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={() => myReq.refetch()}
                disabled={myReq.isFetching}
              >
                Обновить
              </Button>
            ) : null}
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f18] py-14 text-white/50">
            <div className="text-4xl">🔒</div>
            <p>Войдите, чтобы увидеть ваши заявки</p>
          </div>
        ) : myReq.isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-6 text-white/60">
            Загружаем заявки...
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f18] py-14 text-white/50">
            <div className="text-4xl">📭</div>
            <p>У вас пока нет активных заявок</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((r) => (
              <Card
                key={r.id}
                className="relative overflow-hidden rounded-2xl border-white/10 bg-linear-to-b from-[#0f0f18] to-[#0b0b12]"
              >
                {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.10),transparent_55%)]" /> */}

                <CardContent className="relative space-y-3 py-4">
                  {/* top row */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-base font-semibold text-white">
                          {r.destination || "—"}
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
                          <CalendarDays className="h-4 w-4 opacity-80" />
                          {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-4 w-4 opacity-80" />
                          {r.guests} гостей
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Wallet className="h-4 w-4 opacity-80" />
                          {fmtMoney(r.budget_per_night)} {r.currency}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-white/40">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 opacity-70" />
                        создано: {fmtDateTime(r.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* wishes */}
                  {r.wishes ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                      <div className="text-xs font-medium text-white/50 mb-1">
                        Пожелания
                      </div>
                      <div className="line-clamp-3">{r.wishes}</div>
                    </div>
                  ) : null}

                  {/* contacts */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        {r.contact_name || "—"}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        <Phone className="h-4 w-4 opacity-70" />
                        {r.phone || "—"}
                      </span>

                      {r.telegram ? (
                        <a
                          href={`https://t.me/${String(r.telegram).replace(
                            /^@/,
                            ""
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80 hover:bg-white/10 hover:text-white transition"
                          title="Открыть в Telegram"
                        >
                          <Send className="h-4 w-4 opacity-70" />
                          {r.telegram}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
