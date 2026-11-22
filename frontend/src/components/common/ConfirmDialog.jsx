import { X, AlertCircle } from 'lucide-react'
import { Button } from './Button.jsx'

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm action', message = 'Are you sure?', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
  if (!isOpen) return null
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-header">
          <h3 id="confirm-title">{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="modal-content">
          <div className="confirm-body" aria-live="polite">
            <AlertCircle size={22} strokeWidth={2} className="confirm-icon" aria-hidden="true" />
            <p>{message}</p>
          </div>
          <div className="confirm-actions">
            <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
            <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
