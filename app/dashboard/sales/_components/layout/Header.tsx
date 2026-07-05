// "use client"

import { User, Star, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { currentUser } from "../../data/mockData"

export default function Header() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now
          .toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/:/g, ""),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-3 sm:px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-cyan-500 text-white px-2 sm:px-3 py-1 rounded font-bold text-sm">1</div>
          <div className="bg-slate-600 text-white px-2 sm:px-3 py-1 rounded font-bold text-sm">2</div>
        </div>
        <div className="hidden sm:flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
            <Star className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <span className="text-xs sm:text-sm hidden md:block">Favorit...</span>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-6">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="font-medium text-sm sm:text-base">{currentUser.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-lg sm:text-xl font-bold">{currentTime}</span>
        </div>
        <Button variant="destructive" size="sm" className="text-lg font-bold">
          ×
        </Button>
      </div>
    </header>
  )
}
