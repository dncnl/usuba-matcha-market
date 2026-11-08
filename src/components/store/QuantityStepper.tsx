import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled,
  size = "md",
  label = "Quantity",
}: Props) {
  const h = size === "sm" ? "h-8" : "h-12";
  const w = size === "sm" ? "w-8" : "w-11";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border border-foreground/20", h)}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn(
          "flex h-full items-center justify-center rounded-l-full text-foreground/70 transition-colors hover:text-primary disabled:opacity-40",
          w,
        )}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        aria-live="polite"
        className={cn("min-w-8 text-center tabular-nums", size === "sm" ? "text-sm" : "text-base")}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={cn(
          "flex h-full items-center justify-center rounded-r-full text-foreground/70 transition-colors hover:text-primary disabled:opacity-40",
          w,
        )}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
