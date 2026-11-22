import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, children, title, className = '' }) {
  if (!isOpen) return null
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="modal-header">
            <h3 id="modal-title">{title}</h3>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        )}
        <div className="modal-content">{children}</div>
      </div>
    </>
  )
}
