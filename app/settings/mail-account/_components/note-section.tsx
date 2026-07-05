import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NoteSection() {
  return (
    <Card className="shadow-lg border-0 h-full">
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-gray-700" />
          <CardTitle className="text-xl font-semibold text-gray-800">Note</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4 text-gray-700 dark:text-gray-100">
          <p>This account allows sending mail from Flexo.</p>

          <p>The account must be that of your internet provider or your domain.</p>

          <div className="pt-4">
            <p>Les comptes smtp de type &#34;web mail&#34; ne fonctionnent pas (Gmail, Outlook, Yahoo...).</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

