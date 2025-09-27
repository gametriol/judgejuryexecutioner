import * as React from "react"

type SliderProps = {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, max = 100, min = 0, step = 1, className = "", ...props }, ref) => {
    const [dragging, setDragging] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement | null>(null)

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const clamp = (v: number) => Math.max(min, Math.min(max, v))

    const pct = ((clamp(value[0]) - min) / (max - min || 1)) * 100

    const valueForClientX = (clientX: number) => {
      const rect = containerRef.current!.getBoundingClientRect()
      const x = clamp(Math.round(((clientX - rect.left) / rect.width) * (max - min) + min))
      // snap to step
      const snapped = Math.round(x / step) * step
      return clamp(snapped)
    }

    const handlePointerDown = (e: React.PointerEvent) => {
      (e.target as Element).setPointerCapture(e.pointerId)
      setDragging(true)
      const v = valueForClientX(e.clientX)
      onValueChange([v])
    }

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!dragging) return
      const v = valueForClientX(e.clientX)
      onValueChange([v])
    }

    const handlePointerUp = (e: React.PointerEvent) => {
      try { (e.target as Element).releasePointerCapture(e.pointerId) } catch {}
      setDragging(false)
    }

    const handleKey = (e: React.KeyboardEvent) => {
      let cur = clamp(value[0])
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cur = clamp(cur + step)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cur = clamp(cur - step)
      if (cur !== value[0]) onValueChange([cur])
    }

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-5 flex items-center select-none ${className}`}
        {...props}
      >
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full dark:bg-gray-700" />

        {/* Filled */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />

        {/* Thumb (focusable) */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[0]}
          onKeyDown={handleKey}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow cursor-pointer"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }
