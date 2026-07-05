'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { NumberingData } from "../page"

interface AutomaticNumberingProps {
  data: {
    articles: boolean;
    customers: boolean;
    suppliers: boolean;
  };
  onToggleChange: (field: keyof NumberingData, value: boolean) => void;
}

export default function AutomaticNumbering({ data, onToggleChange }: AutomaticNumberingProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl font-semibold">Automatic numbering of new records</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-8">
            <Label htmlFor="articles" className="text-base font-medium">
              Articles
            </Label>
            <Switch 
              id="articles" 
              checked={data.articles}
              onCheckedChange={(checked) => onToggleChange('articles', checked)}
            />
          </div>

          <div className="flex items-center gap-8">
            <Label htmlFor="customers" className="text-base font-medium">
              Customers
            </Label>
            <Switch 
              id="customers" 
              checked={data.customers}
              onCheckedChange={(checked) => onToggleChange('customers', checked)}
            />
          </div>

          <div className="flex items-center gap-8">
            <Label htmlFor="suppliers" className="text-base font-medium">
              Suppliers
            </Label>
            <Switch 
              id="suppliers" 
              checked={data.suppliers}
              onCheckedChange={(checked) => onToggleChange('suppliers', checked)}
            />
          </div>
        </div>
        <Separator className="my-6" />
      </CardContent>
    </Card>
  )
}