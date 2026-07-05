"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function BalanceDueModal({
  open,
  onClose,
  onConfirm,
  message = "There remains a balance Due .. continue?",
}: {
  open: boolean
  onClose: () => void
  onConfirm: (value: boolean) => void
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
          <Button  onClick={() => onConfirm(true)}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
