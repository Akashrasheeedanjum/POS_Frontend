'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getDailyPnl,
  getPurchaseSummary,
  getSalesSummary,
} from '@/lib/actions/businessReports.actions';
import { getAllReceipts } from '@/lib/actions/folder/receipt.actions';
import { formatCurrency } from '@/lib/currency';
import { BarGraph } from './bar-graph';
import { RecentSales } from './recent-sales';

export default function OverViewPage() {
  const { session } = useSession();
  const token = session?.user?.publicMetadata?.token as string | undefined;

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const [loading, setLoading] = useState(true);
  const [pnl, setPnl] = useState<any>(null);
  const [sales, setSales] = useState<any>(null);
  const [purchases, setPurchases] = useState<any>(null);
  const [recentReceipts, setRecentReceipts] = useState<any[]>([]);
  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const periodQuery = `period=${currentMonth}`;
        const [pnlData, salesData, purchaseData, receiptsData] =
          await Promise.all([
            getDailyPnl({ period: currentMonth }, token),
            getSalesSummary({ period: currentMonth }, token),
            getPurchaseSummary({ period: currentMonth }, token),
            getAllReceipts({ query: periodQuery, page: 1, limit: 5 }),
          ]);

        setPnl(pnlData);
        setSales(salesData);
        setPurchases(purchaseData);
        setRecentReceipts(receiptsData?.receipts || []);
        setSalesCount(receiptsData?.count || pnlData?.grandTotals?.salesCount || 0);
      } catch {
        setPnl(null);
        setSales(null);
        setPurchases(null);
        setRecentReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, currentMonth]);

  const totals = pnl?.grandTotals || {};
  const chartData = (pnl?.data || []).map((row: any) => ({
    date: row.date,
    sales: row.salesInclGst || 0,
    purchases: row.scrapPurchases || 0,
    netPnl: row.netPnl || 0,
  }));

  const monthLabel = new Date(`${currentMonth}-01`).toLocaleDateString('en-PK', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Lahore POS Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Scrap Purchase → Production → Sale — {monthLabel}
            </p>
          </div>
          <div className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="outline">
              <Link href="/folder/analysis/pakistanReports">Full Reports</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/sales">POS Sale</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : formatCurrency(totals.salesInclGst || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totals.salesCount || 0} sales this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Scrap Purchased
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading
                      ? '...'
                      : formatCurrency(totals.scrapPurchases || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totals.scrapKg || 0} kg bought from suppliers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gross Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : formatCurrency(totals.grossProfit || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Margin from POS sales
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net PNL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : formatCurrency(totals.netPnl || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Profit after scrap purchases
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph data={chartData} loading={loading} />
              </div>

              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    {loading
                      ? 'Loading...'
                      : `${salesCount} sales this month`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales receipts={recentReceipts} loading={loading} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Link href="/dashboard/scrap-purchase" className="block text-primary underline">
                    1. Scrap Purchase (kg)
                  </Link>
                  <Link href="/dashboard/production" className="block text-primary underline">
                    2. Production
                  </Link>
                  <Link href="/dashboard/articles" className="block text-primary underline">
                    3. Create Product
                  </Link>
                  <Link href="/dashboard/sales" className="block text-primary underline">
                    4. POS Sale
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Sales</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>GST collected: {formatCurrency(totals.gstCollected || 0)}</p>
                  <p>COGS: {formatCurrency(totals.cogs || 0)}</p>
                  <p>Qty sold: {sales?.grandTotals?.totalQuantity || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Purchases</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    Total:{' '}
                    {formatCurrency(
                      purchases?.grandTotals?.totalPurchaseAmount || 0,
                    )}
                  </p>
                  <p>
                    Orders: {purchases?.grandTotals?.purchaseCount || 0}
                  </p>
                  <p>
                    Scrap: {purchases?.grandTotals?.totalQuantityKg || 0} kg
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
