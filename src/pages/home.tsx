import { Send } from "lucide-react";
import { useState } from "react";

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
import type { RequestCreateBody } from "@/types/api";

export default function Home() {
  const [form, setForm] = useState<RequestCreateBody>({
    destination: "",
    check_in: "",
    check_out: "",
    guests: 1,
    budget_per_night: 0,
    currency: "RUB",
    wishes: "",
    contact_name: "",
    phone: "",
    telegram: "",
  });

  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const set = <K extends keyof RequestCreateBody>(
    key: K,
    value: RequestCreateBody[K]
  ) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Container>
      {/* REQUEST FORM */}
      <Card className="border-white/10 bg-linear-to-b from-[#0f0f18] to-[#0b0b12]">
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
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => set("guests", Number(e.target.value))}
              />
            </div>
          </div>

          {/* BUDGET */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* BUDGET */}
            <div>
              <label className="mb-1 block text-sm text-white/80">
                Бюджет в сутки
              </label>

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={form.budget_per_night}
                  onChange={(e) =>
                    set("budget_per_night", Number(e.target.value))
                  }
                />

                <Select
                  value={form.currency}
                  onValueChange={(v) => set("currency", v as "USD" | "RUB")}
                >
                  <SelectTrigger className="w-24 bg-[#0f0f18]  border-white/10 text-white">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                placeholder="Ваше имя"
                value={form.contact_name}
                onChange={(e) => set("contact_name", e.target.value)}
              />
              <Input
                placeholder="Телефон или Telegram"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* FOOTER */}
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              🔒 Ваши контакты видны только платным подписчикам
            </p>

            <Button
              size="lg"
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400 md:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              Оставить заявку
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MY REQUESTS */}
      <div className="mt-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Мои заявки</h2>
          <span className="text-sm text-white/50">У вас 0 активных заявок</span>
        </div>

        <div className="flex flex-col items-center gap-3 py-16 text-white/50">
          <div className="text-4xl">📭</div>
          <p>У вас пока нет активных заявок</p>
        </div>
      </div>
    </Container>
  );
}
