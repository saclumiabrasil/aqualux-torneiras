import { Droplet } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  variant?: "light" | "dark"
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-heading font-bold", className)}>
      <Droplet
        className={cn("size-6 fill-brand-sky", variant === "light" ? "text-brand-sky" : "text-brand-sky")}
        strokeWidth={1.5}
      />
      <span className="text-xl leading-none tracking-tight">
        <span className={variant === "light" ? "text-white" : "text-primary"}>Aqua</span>
        <span className="text-brand-sky">Lux</span>
      </span>
    </span>
  )
}
