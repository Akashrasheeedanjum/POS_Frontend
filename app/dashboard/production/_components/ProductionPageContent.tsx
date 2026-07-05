'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createProduction,
  getProductions,
  ProductionRecord,
} from '@/lib/actions/production.actions';
import {
  getScrapPurchases,
  ScrapPurchase,
} from '@/lib/actions/scrapPurchase.actions';
import { formatCurrency } from '@/lib/currency';

export default function ProductionPageContent() {
  const { session } = useSession();
  const token = session?.user?.publicMetadata?.token as string | undefined;

  const [scrapPurchases, setScrapPurchases] = useState<ScrapPurchase[]>([]);
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    scrapPurchaseId: '',
    quantityUsed: '',
    outputDesignation: '',
    outputQuantity: '',
    markupPercent: '25',
    remarks: '',
  });

  const loadData = async () => {
    if (!token) return;
    try {
      const [availableScrap, productionList] = await Promise.all([
        getScrapPurchases(true, token),
        getProductions(token),
      ]);
      setScrapPurchases(availableScrap || []);
      setProductions(productionList || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load production data');
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      await createProduction(
        {
          scrapPurchaseId: form.scrapPurchaseId,
          quantityUsed: Number(form.quantityUsed),
          outputDesignation: form.outputDesignation,
          outputQuantity: Number(form.outputQuantity),
          markupPercent: Number(form.markupPercent),
          remarks: form.remarks || undefined,
        },
        token,
      );
      toast.success('Production completed and product stock updated');
      setForm({
        scrapPurchaseId: '',
        quantityUsed: '',
        outputDesignation: '',
        outputQuantity: '',
        markupPercent: '25',
        remarks: '',
      });
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to run production');
    } finally {
      setLoading(false);
    }
  };

  const selectedScrap = scrapPurchases.find(
    (item) => item._id === form.scrapPurchaseId,
  );

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Production</h1>
        <p className="text-muted-foreground">
          Step 2: Convert scrap into finished goods and auto-create product stock
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run Production</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Scrap Purchase</Label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={form.scrapPurchaseId}
                onChange={(e) =>
                  setForm({ ...form, scrapPurchaseId: e.target.value })
                }
                required
              >
                <option value="">Select available scrap purchase</option>
                {scrapPurchases.map((purchase) => (
                  <option key={purchase._id} value={purchase._id}>
                    {purchase.purchaseNo} - {purchase.materialType} (
                    {purchase.remainingQuantity}
                    {purchase.unit} left)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Scrap Used</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                max={selectedScrap?.remainingQuantity}
                value={form.quantityUsed}
                onChange={(e) =>
                  setForm({ ...form, quantityUsed: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Output Quantity</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={form.outputQuantity}
                onChange={(e) =>
                  setForm({ ...form, outputQuantity: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Output Product Name</Label>
              <Input
                placeholder="e.g. Copper Wire 2.5mm"
                value={form.outputDesignation}
                onChange={(e) =>
                  setForm({ ...form, outputDesignation: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Selling Markup %</Label>
              <Input
                type="number"
                min="0"
                value={form.markupPercent}
                onChange={(e) =>
                  setForm({ ...form, markupPercent: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Complete Production'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production History</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Production No</th>
                <th className="p-2">Scrap Used</th>
                <th className="p-2">Product</th>
                <th className="p-2">Output Qty</th>
                <th className="p-2">Unit Cost</th>
                <th className="p-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((record) => (
                <tr key={record._id} className="border-b">
                  <td className="p-2">{record.productionNo}</td>
                  <td className="p-2">
                    {record.quantityUsed} {record.scrapPurchase?.unit}
                  </td>
                  <td className="p-2">
                    {record.outputArticle?.designation || record.outputDesignation}
                  </td>
                  <td className="p-2">{record.outputQuantity}</td>
                  <td className="p-2">{formatCurrency(record.unitCost)}</td>
                  <td className="p-2">
                    {formatCurrency(record.productionCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
