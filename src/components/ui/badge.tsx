import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium font-body ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-primary/20",
        secondary: "bg-secondary text-secondary-foreground ring-secondary/30",
        destructive: "bg-destructive/10 text-destructive ring-destructive/20",
        outline: "text-foreground ring-border",
        active: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
        inactive: "bg-zinc-500/10 text-zinc-500 ring-zinc-500/20",
        pending: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
        admin: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
        editor: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
        viewer: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
