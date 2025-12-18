// src/pages/owner-login.tsx
import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const cardClass =
  "border-white/10 bg-gradient-to-b from-[#0f0f18] to-[#0b0b12]";

const inputClass =
  "bg-black/30 text-white placeholder:text-white/40 border-white/10 focus-visible:ring-0";

export default function OwnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container className="animate__animated animate__fadeIn">
      <div className="flex items-center justify-center">
        <Card
          className={[
            cardClass,
            "w-full sm:max-w-sm overflow-hidden rounded-2xl",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_80px_rgba(0,0,0,0.55)]",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)]" />
          {/* soft glow */}
          {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)]" /> */}

          <CardHeader className="relative space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-white">
              Вход для владельцев
            </h1>
            <p className="text-sm text-muted-foreground">
              Доступ к базе заявок на проживание
            </p>
          </CardHeader>

          <CardContent className="relative space-y-5">
            {/* EMAIL */}
            <div>
              <label className="mb-1 block text-sm text-white/80">Email</label>
              <Input
                className={inputClass}
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1 block text-sm text-white/80">Пароль</label>
              <Input
                className={inputClass}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* LOGIN */}
            <Button className="w-full bg-violet-600 text-white hover:bg-violet-700">
              <LogIn className="mr-2 h-4 w-4" />
              Войти
            </Button>

            {/* divider like home */}
            <div className="relative py-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f0f18] px-2 text-xs text-muted-foreground">
                или
              </span>
            </div>

            {/* REGISTER */}
            <Button
              variant="outline"
              className="w-full border-white/10 bg-transparent text-white hover:bg-transparent"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Зарегистрироваться
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              После регистрации вы получите доступ
              <br />к заявкам на 7 дней бесплатно
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
