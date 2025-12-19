import { Loader2, Lock, Mail } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useLoginMutation, useRegisterMutation } from "../api/auth.service";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
};

function getMsg(r?: any) {
  return (
    r?.data?.message ||
    r?.error?.data?.message ||
    r?.error?.data?.msg ||
    "Ошибка. Попробуйте позже."
  );
}

export function AuthModal({ open, onOpenChange, onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, loginState] = useLoginMutation();
  const [register, regState] = useRegisterMutation();

  const busy = loginState.isLoading || regState.isLoading;

  const canSubmit = useMemo(() => {
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const okPass = password.length >= 6;
    return okEmail && okPass && !busy;
  }, [email, password, busy]);

  const submit = async () => {
    const body = { email: email.trim(), password };
    const res = mode === "login" ? await login(body) : await register(body);

    if ("data" in res) {
      onOpenChange(false);
      onSuccess?.();
      return;
    }

    toast.info(getMsg(res));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
    fixed left-1/2 top-1/2 z-50
    w-full max-w-md
    -translate-x-1/2 -translate-y-1/2
    overflow-hidden
    border border-white/10
    bg-linear-to-b from-[#0f0f18] to-[#0b0b12]
    shadow-2xl
  "
      >
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_60%)]" />

        <DialogHeader className="relative space-y-1">
          <DialogTitle className="text-center text-2xl font-semibold text-white">
            {mode === "login" ? "Добро пожаловать" : "Создание аккаунта"}
          </DialogTitle>
          <p className="text-center text-sm text-white/50">
            {mode === "login"
              ? "Войдите, чтобы продолжить"
              : "Заполните данные для регистрации"}
          </p>
        </DialogHeader>

        {/* MODE SWITCH */}
        <div className="relative mt-4 grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setMode("register")}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              mode === "register"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* FORM */}
        <div className="relative mt-6 space-y-4">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <Label className="text-white/70">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                autoComplete="email"
                className="pl-9"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <Label className="text-white/70">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="pl-9"
              />
            </div>
            {mode === "register" ? (
              <p className="text-xs text-white/40">Минимум 6 символов</p>
            ) : null}
          </div>

          {/* SUBMIT */}
          <Button
            className="mt-2 w-full bg-emerald-500 text-black hover:bg-emerald-400"
            disabled={!canSubmit}
            onClick={submit}
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
