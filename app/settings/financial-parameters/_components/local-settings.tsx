"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface LocalSettingsProps {
  currencySymbol: string
  decimalPlaces: number
  enableFidelity: boolean
  fidelityBonus: number
  fidelityTotalPurchaseRequired: number
  enableDailyGoal: boolean
  dailyTurnoverGoal: number
  onLocalSettingsUpdate: (settings: {
    currencySymbol?: string
    decimalPlaces?: number
    enableFidelity?: boolean
    fidelityBonus?: number
    fidelityTotalPurchaseRequired?: number
    enableDailyGoal?: boolean
    dailyTurnoverGoal?: number
  }) => void
}

export default function LocalSettings({
  currencySymbol,
  decimalPlaces,
  enableFidelity,
  fidelityBonus,
  fidelityTotalPurchaseRequired,
  enableDailyGoal,
  dailyTurnoverGoal,
  onLocalSettingsUpdate
}: LocalSettingsProps) {
  const handleChange = (field: string, value: string | number | boolean) => {
    onLocalSettingsUpdate({ [field]: value })
  }

  return (
    <div className="w-full flex justify-center my-6">
      <Card className="border border-gray-200 w-full pt-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Local Settings Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Local Settings</h3>
                <div className="h-1 w-10 bg-primary rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="decimal">Decimal</Label>
                  <Input
                    id="decimal"
                    value={decimalPlaces}
                    onChange={(e) => handleChange('decimalPlaces', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency Symbol</Label>
                  <Input
                    id="currency"
                    value={currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator className="md:hidden" />

            {/* Fidelity Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Fidelity</h3>
                <div className="h-1 w-10 bg-primary rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fidelity-switch">Enable fidelity</Label>
                  <Switch
                    id="fidelity-switch"
                    checked={enableFidelity}
                    onCheckedChange={(checked) => handleChange('enableFidelity', checked)}
                  />
                </div>
                <div className={`space-y-3 ${enableFidelity ? "opacity-100" : "opacity-50"}`}>
                  <div className="space-y-1.5">
                    <Label htmlFor="bonus">A bonus of</Label>
                    <Input
                      id="bonus"
                      value={fidelityBonus}
                      onChange={(e) => handleChange('fidelityBonus', parseInt(e.target.value) || 0)}
                      disabled={!enableFidelity}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="purchase">will be granted after a total purchase of</Label>
                    <Input
                      id="purchase"
                      value={fidelityTotalPurchaseRequired}
                      onChange={(e) => handleChange('fidelityTotalPurchaseRequired', parseInt(e.target.value) || 0)}
                      disabled={!enableFidelity}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="md:hidden" />

            {/* Daily Goal Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Daily Goal</h3>
                <div className="h-1 w-10 bg-primary rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="turnover">Turnover</Label>
                  <Input
                    id="turnover"
                    value={dailyTurnoverGoal}
                    onChange={(e) => handleChange('dailyTurnoverGoal', parseInt(e.target.value) || 0)}
                    disabled={!enableDailyGoal}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="daily-goal-switch">Enable daily goal</Label>
                  <Switch
                    id="daily-goal-switch"
                    checked={enableDailyGoal}
                    onCheckedChange={(checked) => handleChange('enableDailyGoal', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}