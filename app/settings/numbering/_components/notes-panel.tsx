import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NotesPanel() {
  return (
    <Card className="shadow-md h-full bg-muted/10">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Note
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="p-3 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-600 font-medium">Do not change the numbering during the year under errors</p>
          </div>

          <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-blue-700">
              Numbering can be changed in a new year or when initializing the current folder
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

