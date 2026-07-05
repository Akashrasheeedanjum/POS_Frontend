'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { NumberingData } from "../page"

interface DocumentNumbersProps {
  data: {
    receipts: number;
    invoices: number;
    creditNotes: number;
    quotations: number;
    salesOrders: number;
    deliveryNotes: number;
    supplierOrders: number;
    repairOrders: number;
  };
  onNumberChange: (field: keyof NumberingData, value: number) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function DocumentNumbers({ 
  data, 
  onNumberChange, 
  onSave, 
  isLoading 
}: DocumentNumbersProps) {
  const handleChange = (field: keyof NumberingData, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      onNumberChange(field, numValue);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl font-semibold">Document numbers</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="receipts" className="text-base font-medium">
              Receipts
            </Label>
            <Input 
              id="receipts" 
              value={data.receipts.toString()} 
              onChange={(e) => handleChange('receipts', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoices" className="text-base font-medium">
              Invoices
            </Label>
            <Input 
              id="invoices" 
              value={data.invoices.toString()} 
              onChange={(e) => handleChange('invoices', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit-notes" className="text-base font-medium">
              Credit notes
            </Label>
            <Input 
              id="credit-notes" 
              value={data.creditNotes.toString()} 
              onChange={(e) => handleChange('creditNotes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quotation" className="text-base font-medium">
              Quotation
            </Label>
            <Input 
              id="quotation" 
              value={data.quotations.toString()} 
              onChange={(e) => handleChange('quotations', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sales-orders" className="text-base font-medium">
              Sales Orders
            </Label>
            <Input 
              id="sales-orders" 
              value={data.salesOrders.toString()} 
              onChange={(e) => handleChange('salesOrders', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery-notes" className="text-base font-medium">
              Delivery notes
            </Label>
            <Input 
              id="delivery-notes" 
              value={data.deliveryNotes.toString()} 
              onChange={(e) => handleChange('deliveryNotes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-orders" className="text-base font-medium">
              Supplier orders
            </Label>
            <Input 
              id="supplier-orders" 
              value={data.supplierOrders.toString()} 
              onChange={(e) => handleChange('supplierOrders', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-orders" className="text-base font-medium">
              Repair orders
            </Label>
            <Input 
              id="repair-orders" 
              value={data.repairOrders.toString()} 
              onChange={(e) => handleChange('repairOrders', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={onSave}
            disabled={isLoading}
            className="px-4 py-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}