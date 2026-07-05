"use client"

import { Layers, X } from "lucide-react"

export function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Categories of Products</h2>
      </div>
      <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="Close">
        <X className="h-6 w-6" />
      </button>
    </div>
  )
}
