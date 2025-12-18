// src/components/guest/guest-account-card.tsx
import { LogIn, LogOut, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { emailInitials, shortEmail } from "@/lib/user";

type Props = {
  email?: string | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  busy?: boolean;
};

export function GuestAccountCard({
  email,
  onLogin,
  onRegister,
  onLogout,
  busy,
}: Props) {
  const isAuthed = !!email;

  return (
    <Card
      className={[
        "relative overflow-hidden rounded-2xl",
        "border-white/10 bg-linear-to-b from-[#0f0f18] to-[#0b0b12]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_80px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      {/* soft violet glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12),transparent_60%)]" />

      <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: status */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white/10 bg-black/30">
            <AvatarFallback className="bg-transparent text-white/90">
              {emailInitials(email)}
            </AvatarFallback>
          </Avatar>

          <div className="leading-tight">
            <div className="text-sm font-medium text-white">
              {isAuthed ? "Вы вошли как гость" : "Гостевой доступ"}
            </div>
            <div className="text-xs text-muted-foreground">
              {isAuthed
                ? shortEmail(email)
                : "Войдите или зарегистрируйтесь, чтобы видеть свои заявки"}
            </div>
          </div>
        </div>

        {/* RIGHT: actions */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {!isAuthed ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/10 bg-transparent text-white hover:bg-transparent sm:w-auto"
                onClick={onLogin}
                disabled={busy}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Button>

              <Button
                type="button"
                className="w-full bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"
                onClick={onRegister}
                disabled={busy}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Регистрация
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10 bg-transparent text-white hover:bg-transparent sm:w-auto"
              onClick={onLogout}
              disabled={busy}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
