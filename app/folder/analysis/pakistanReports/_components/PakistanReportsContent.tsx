'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getDailyPnl,
  getPurchaseJournal,
  getPurchaseSummary,
  getSalesSummary,
} from '@/lib/actions/businessReports.actions';
import { formatCurrency } from '@/lib/currency';

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle ? (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function PakistanReportsContent() {
  const { session } = useSession();
  const token = session?.user?.publicMetadata?.token as string | undefined;

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const [period, setPeriod] = useState(currentMonth);
  const [date, setDate] = useState('');
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');
  const [loading, setLoading] = useState(false);
  const [pnl, setPnl] = useState<any>(null);
  const [sales, setSales] = useState<any>(null);
  const [purchases, setPurchases] = useState<any>(null);
  const [journal, setJournal] = useState<any>(null);

  const filterParams =
    viewMode === 'daily' && date ? { date } : { period };

  const loadReports = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pnlData, salesData, purchaseData, journalData] = await Promise.all([
        getDailyPnl(filterParams, token),
        getSalesSummary(filterParams, token),
        getPurchaseSummary(filterParams, token),
        getPurchaseJournal({ ...filterParams, page: 1, limit: 50 }, token),
      ]);
      setPnl(pnlData);
      setSales(salesData);
      setPurchases(purchaseData);
      setJournal(journalData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [token, period, date, viewMode]);

  const pnlTotals = pnl?.grandTotals;
  const salesTotals = sales?.grandTotals;
  const purchaseTotals = purchases?.grandTotals;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Pakistan Business Reports</h1>
        <p className="text-muted-foreground">
          Scrap Purchase → Production → Product Sale — daily and monthly PNL in Rs
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Report View</Label>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={viewMode}
              onChange={(e) =>
                setViewMode(e.target.value as 'monthly' | 'daily')
              }
            >
              <option value="monthly">Monthly</option>
              <option value="daily">Single Day</option>
            </select>
          </div>

          {viewMode === 'monthly' ? (
            <div className="space-y-2">
              <Label>Month</Label>
              <Input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Date (DD/MM/YYYY)</Label>
              <Input
                placeholder="05/07/2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-end md:col-span-2">
            <Button onClick={loadReports} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Reports'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Sales (incl. GST)"
          value={formatCurrency(pnlTotals?.salesInclGst || 0)}
          subtitle={`${pnlTotals?.salesCount || 0} sales`}
        />
        <SummaryCard
          title="Scrap Purchases"
          value={formatCurrency(pnlTotals?.scrapPurchases || 0)}
          subtitle={`${pnlTotals?.scrapKg || 0} kg purchased`}
        />
        <SummaryCard
          title="Gross Profit (Sales)"
          value={formatCurrency(pnlTotals?.grossProfit || 0)}
          subtitle="Margin from POS sales"
        />
        <SummaryCard
          title="Net PNL"
          value={formatCurrency(pnlTotals?.netPnl || 0)}
          subtitle="Gross profit minus scrap purchases"
        />
      </div>

      <Tabs defaultValue="pnl">
        <TabsList>
          <TabsTrigger value="pnl">Daily PNL</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="journal">Purchase Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl">
          <Card>
            <CardHeader>
              <CardTitle>Profit and Loss (PKR)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Sales (incl GST)</th>
                    <th className="p-2">GST</th>
                    <th className="p-2">COGS</th>
                    <th className="p-2">Gross Profit</th>
                    <th className="p-2">Scrap Purchase</th>
                    <th className="p-2">Net PNL</th>
                  </tr>
                </thead>
                <tbody>
                  {(pnl?.data || []).map((row: any) => (
                    <tr key={row.date} className="border-b">
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{formatCurrency(row.salesInclGst)}</td>
                      <td className="p-2">{formatCurrency(row.gstCollected)}</td>
                      <td className="p-2">{formatCurrency(row.cogs)}</td>
                      <td className="p-2">{formatCurrency(row.grossProfit)}</td>
                      <td className="p-2">{formatCurrency(row.scrapPurchases)}</td>
                      <td className="p-2 font-semibold">{formatCurrency(row.netPnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>
                Sales Summary — Total {formatCurrency(salesTotals?.totalSalesInclGst || 0)}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Sales Count</th>
                    <th className="p-2">Qty Sold</th>
                    <th className="p-2">Sales (excl GST)</th>
                    <th className="p-2">GST</th>
                    <th className="p-2">Sales (incl GST)</th>
                    <th className="p-2">Gross Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {(sales?.data || []).map((row: any) => (
                    <tr key={row.date} className="border-b">
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.salesCount}</td>
                      <td className="p-2">{row.totalQuantity}</td>
                      <td className="p-2">{formatCurrency(row.totalSalesExclGst)}</td>
                      <td className="p-2">{formatCurrency(row.totalGst)}</td>
                      <td className="p-2">{formatCurrency(row.totalSalesInclGst)}</td>
                      <td className="p-2">{formatCurrency(row.grossProfit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>
                Scrap Purchases — Total {formatCurrency(purchaseTotals?.totalPurchaseAmount || 0)}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Purchases</th>
                    <th className="p-2">Qty (kg)</th>
                    <th className="p-2">Amount (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {(purchases?.data || []).map((row: any) => (
                    <tr key={row.date} className="border-b">
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.purchaseCount}</td>
                      <td className="p-2">{row.totalQuantityKg}</td>
                      <td className="p-2">{formatCurrency(row.totalPurchaseAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Scrap Purchase Journal</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Purchase No</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Supplier</th>
                    <th className="p-2">Material</th>
                    <th className="p-2">Qty (kg)</th>
                    <th className="p-2">Rate/kg</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {(journal?.data || []).map((row: any) => (
                    <tr key={row._id} className="border-b">
                      <td className="p-2">{row.purchaseNo}</td>
                      <td className="p-2">
                        {new Date(row.purchaseDate).toLocaleDateString('en-PK')}
                      </td>
                      <td className="p-2">{row.supplier?.nameDenomination}</td>
                      <td className="p-2">{row.materialType}</td>
                      <td className="p-2">{row.quantity}</td>
                      <td className="p-2">{formatCurrency(row.unitPrice)}</td>
                      <td className="p-2">{formatCurrency(row.totalAmount)}</td>
                      <td className="p-2">
                        {row.remainingQuantity} {row.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
