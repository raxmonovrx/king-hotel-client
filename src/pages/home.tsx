// src/pages/home.tsx
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function Home() {
  return (
    <Container className="py-10">
      {/* REQUEST FORM */}
      <Card className="border-white/10 bg-gradient-to-b from-[#0f0f18] to-[#0b0b12]">
        <CardHeader className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Найдите идеальное жилье без поиска
          </h1>
          <p className="text-sm text-muted-foreground">
            Оставьте заявку — владельцы сами предложат вам лучшие варианты
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Куда едете?</label>
              <Input placeholder="Сочи, Адлер, Геленджик..." />
            </div>

            <div>
              <label className="mb-1 block text-sm">Заезд</label>
              <Input type="date" />
            </div>

            <div>
              <label className="mb-1 block text-sm">Выезд</label>
              <Input type="date" />
            </div>

            <div>
              <label className="mb-1 block text-sm">Гостей</label>
              <Input type="number" min={1} placeholder="2" />
            </div>
          </div>

          {/* BUDGET */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Бюджет в сутки (₽)</label>
              <Input type="number" placeholder="3000" />
            </div>
          </div>

          {/* WISHES */}
          <div>
            <label className="mb-1 block text-sm">Особые пожелания</label>
            <Textarea
              rows={3}
              placeholder="1-я линия, вид на море, парковка, с животными..."
            />
          </div>

          {/* CONTACTS */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Ваши контакты для связи
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Ваше имя" />
              <Input placeholder="Телефон или Telegram" />
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
