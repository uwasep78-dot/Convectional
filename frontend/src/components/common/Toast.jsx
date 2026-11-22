import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const add = useCallback((toast) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...toast, id }])
    if (toast.autoDismiss !== false) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), toast.duration || 5000)
    }
    return id
  }, [])
  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])
  return (
    <ToastContext.Provider value={{ toasts, add, remove }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`} role="alert">
          {toast.icon && <span aria-hidden="true">{toast.icon}</span>}
          <div className="toast-body">
            <strong className="toast-title">{toast.title}</strong>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button type="button" className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
