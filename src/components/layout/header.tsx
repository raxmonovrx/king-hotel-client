import { Crown } from "lucide-react";
import { RoleSwitch } from "../RoleSwitch";
import { Container } from "./container";

export function Header() {
  return (
    <header className="flex flex-col pt-4">
      <Container className="flex h-14 items-center justify-between sm:h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-semibold sm:text-2xl">
          <Crown className="h-9 w-9 text-violet-500 sm:h-10 sm:w-10" />
          King
        </div>

        {/* Role switch */}
        <RoleSwitch />
      </Container>

      {/* Divider */}
      <div className="h-px mt-1 sm:m-0 w-full bg-linear-to-r from-transparent via-white/10 to-transparent " />
    </header>
  );
}
