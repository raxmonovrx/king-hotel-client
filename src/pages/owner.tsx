import { LogIn } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { selectUser } from "@/features/auth/api/auth.selectors";
import { useLoginMutation, useMeQuery } from "@/features/auth/api/auth.service";
import { useAppSelector } from "@/hooks";
import { getMsg } from "@/lib/get-msg";

const cardClass =
  "border-white/10 bg-gradient-to-b from-[#0f0f18] to-[#0b0b12]";

const inputClass =
  "bg-black/30 text-white placeholder:text-white/40 border-white/10 focus-visible:ring-0";

export default function OwnerLoginPage() {
  const user = useAppSelector(selectUser);
  useMeQuery(undefined);

  const [login, loginState] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim() && password.trim() && !loginState.isLoading;

  const onSubmit = async () => {
    if (!canSubmit) return;

    const t = toast.loading("Входим...");
    const res = await login({ email, password });

    if ("data" in res) {
      toast.success(res.data?.message ?? "Успешный вход", { id: t });
      // redirect pastdagi condition orqali bo‘ladi
      return;
    }

    toast.error(getMsg(res), { id: t });
  };

  // ✅ redirect hooklardan keyin
  if (user?.role === "owner") {
    return <Navigate to="/owner/dashboard" replace />;
  }

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

          <CardHeader className="relative space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-white">
              Вход для владельцев
            </h1>
            <p className="text-sm text-muted-foreground">
              Доступ к базе заявок на проживание
            </p>
          </CardHeader>

          <CardContent className="relative space-y-5">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Email
                </label>
                <Input
                  className={inputClass}
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/80">
                  Пароль
                </label>
                <Input
                  className={inputClass}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 text-white hover:bg-violet-700"
                disabled={!canSubmit}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
