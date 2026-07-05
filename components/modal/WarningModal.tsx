"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function WarningModal({
  open,
  onClose,
  onConfirm,
  message = "Operation not allowed!",
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <p className="text-center text-black">{message}</p>
        <DialogFooter className="flex justify-end gap-2">
          <Button 
          onClick={onConfirm}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
