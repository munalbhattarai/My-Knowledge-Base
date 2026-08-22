import { Modal } from './Modal'
import Button from './Button'

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', busy, tone = 'danger' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      width="sm"
      hideClose
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger-solid' : 'primary'}
            onClick={onConfirm}
            loading={busy}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}