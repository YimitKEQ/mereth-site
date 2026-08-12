import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ChevronDown } from "@/components/ui/icons";

/**
 * Framed select. The native control is kept and styled rather than rebuilt,
 * so keyboard behaviour, mobile pickers and form semantics come for free; only
 * the chevron is drawn, because the native one cannot be recoloured.
 */
export function Select({
  label,
  options,
  className = "",
  ...rest
}: {
  label: string;
  options: readonly string[];
  className?: string;
} & Omit<React.ComponentProps<"select">, "className">) {
  return (
    <div
      className={`relative flex h-12 items-center border border-brand-accent/70 bg-black/60 pr-3 pl-4 text-brand-accent ${className}`}
    >
      <FrameCorners weight="thin" />
      <select
        aria-label={label}
        className="font-display relative w-full appearance-none bg-transparent pr-6 text-xs tracking-widest text-brand-accent outline-none"
        {...rest}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-brand-dark text-white">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 text-brand-accent" />
    </div>
  );
}
