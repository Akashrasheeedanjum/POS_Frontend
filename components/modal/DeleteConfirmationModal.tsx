"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  message = "Do you want to delete this record?",
  loadingState
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
  loadingState?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <p className="text-center text-red-500">{message}</p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button 
          className={loadingState? "opacity-40 cursor-not-allowed": ""} 
          disabled={loadingState}
          onClick={onConfirm}>
            {loadingState? 'Deleting...': 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
