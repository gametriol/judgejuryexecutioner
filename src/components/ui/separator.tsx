import * as React from "react"

const Separator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div"> & { orientation?: "horizontal" | "vertical" }>(
  ({ className = "", orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={`shrink-0 bg-gray-200 dark:bg-gray-800 ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
