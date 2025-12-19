import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  value?: Date;
  onChange: (d?: Date) => void;
  placeholder?: string;
};

export function DatePicker({ value, onChange, placeholder }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start bg-[#0f0f18] text-left font-normal text-white border-white/10",
            !value && "text-white/40"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd.MM.yyyy") : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 bg-[#0f0f18] border-white/10">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          captionLayout="dropdown"
          classNames={{
            // ✅ bugungi kun (today) ko'rinadigan bo'ladi
            day_today:
              "bg-violet-500/20 text-white border border-violet-500/30 rounded-md",

            // ✅ tanlangan kun (selected) aniq ajralib turadi
            day_selected:
              "bg-violet-500 text-white hover:bg-violet-500 hover:text-white focus:bg-violet-500 focus:text-white rounded-md",

            // ✅ tashqi oy kunlari dim
            day_outside: "text-white/25 opacity-50",

            // ✅ disable bo'lsa
            day_disabled: "text-white/20 opacity-40",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
