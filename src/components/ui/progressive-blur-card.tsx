
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const ProgressiveBlurCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  
  return (
    <Comp
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    />
  )
})
ProgressiveBlurCard.displayName = "ProgressiveBlurCard"

export { ProgressiveBlurCard }
