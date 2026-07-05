"use client"

import { Save } from "lucide-react"

export function ModalFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="border-t p-4 bg-gray-50 flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow transition-all flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        <span>Save & Close</span>
      </button>
    </div>
  )
}
