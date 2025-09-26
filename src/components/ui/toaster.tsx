import * as React from "react"

interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, title, description, type = "default", duration = 5000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const typeStyles = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200", 
    warning: "bg-yellow-50 border-yellow-200"
  }

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 z-50 ${typeStyles[type]}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        <button 
          onClick={() => onClose(id)}
          className="ml-3 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  )
}

interface ToastContextType {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, 'id' | 'onClose'>) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastProps = {
      ...props,
      id,
      onClose: (toastId) => {
        setToasts(prev => prev.filter(t => t.id !== toastId))
      }
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toasts.map(toastProps => (
          <Toast key={toastProps.id} {...toastProps} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const Toaster: React.FC = () => {
  return null
}
