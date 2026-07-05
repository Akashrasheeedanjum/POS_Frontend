"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  message = "Do you want to proceed?",
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <p className="text-center text-red-500">{message}</p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button  onClick={onConfirm}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
