import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const base =
  "flex h-8 items-center justify-center rounded-lg px-4 text-sm font-medium select-none";

export function RoleSwitch() {
  return (
    <div className="flex rounded-xl gap-2 border border-white/10 bg-[#14141d] p-1">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            base,
            isActive ? "bg-violet-600 text-white" : "text-muted-foreground"
          )
        }
      >
        Гость
      </NavLink>

      <NavLink
        to="/owner"
        className={({ isActive }) =>
          cn(
            base,
            isActive ? "bg-violet-600 text-white" : "text-muted-foreground"
          )
        }
      >
        Владелец
      </NavLink>
    </div>
  );
}
