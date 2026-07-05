"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function RecordedOperation({
  open,
  onClose,
  onConfirm,
  toRender,
  message = "Recorded Operation.. ",
}: {
  open: boolean
  onClose: () => void
  onConfirm: (value: boolean) => void
  toRender: number
  message?: string
}) {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <p className="text-start">{message}</p>
        <p className="text-center text-[1.25rem]">To render <span className="text-red-500">-{toRender.toFixed(2)}</span></p>
        <DialogFooter className="flex justify-end gap-2">
          <Button className="bg-cyan-500 text-white"  onClick={() => onConfirm(true)}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
