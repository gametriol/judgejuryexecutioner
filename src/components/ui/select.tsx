import * as React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "item-aligned" | "popper"
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

// Context for managing select state
const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>({})

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ onValueChange, value, children, className = "", ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "")
    const [open, setOpen] = React.useState(false)

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <SelectContext.Provider
        value={{
          value: internalValue,
          onValueChange: handleValueChange,
          open,
          onOpenChange: setOpen,
        }}
      >
        {children}
      </SelectContext.Provider>
    )
  }
)

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = "", children, onClick, ...props }, ref) => {
    const { value, open, onOpenChange } = React.useContext(SelectContext)
    
    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 ${className}`}
        onClick={(e) => {
          onOpenChange?.(!open)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 opacity-50"
        >
          <path
            d="m4.5 6 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )
  }
)

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className = "", placeholder, ...props }, ref) => {
    const { value } = React.useContext(SelectContext)
    
    return (
      <span ref={ref} className={className} {...props}>
        {value || placeholder}
      </span>
    )
  }
)

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = "", children, ...props }, ref) => {
    const { open } = React.useContext(SelectContext)
    
    if (!open) return null
    
    return (
      <div
        ref={ref}
        className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 ${className}`}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    )
  }
)

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = "", children, value, onClick, ...props }, ref) => {
    const { onValueChange, onOpenChange } = React.useContext(SelectContext)
    
    return (
      <div
        ref={ref}
        role="option"
        className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${className}`}
        onClick={(e) => {
          onValueChange?.(value)
          onOpenChange?.(false)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Select.displayName = "Select"
SelectTrigger.displayName = "SelectTrigger"
SelectValue.displayName = "SelectValue"
SelectContent.displayName = "SelectContent"
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
