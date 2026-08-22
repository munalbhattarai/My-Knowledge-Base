import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { pushToast } from '@/store/slices/uiSlice'

export function useToast() {
  const dispatch = useDispatch()

  const success = useCallback(
    (title, message) => dispatch(pushToast({ type: 'success', title, message })),
    [dispatch],
  )
  const error = useCallback(
    (title, message) => dispatch(pushToast({ type: 'error', title, message })),
    [dispatch],
  )
  const info = useCallback(
    (title, message) => dispatch(pushToast({ type: 'info', title, message })),
    [dispatch],
  )

  return { success, error, info }
}