'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createScrapPurchase,
  getScrapPurchases,
  ScrapPurchase,
} from '@/lib/actions/scrapPurchase.actions';
import { allSuppliers } from '@/lib/actions/suppliers.action';
import { formatCurrency } from '@/lib/currency';

export default function ScrapPurchasePageContent() {
  const { session } = useSession();
  const token = session?.user?.publicMetadata?.token as string | undefined;

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<ScrapPurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    supplier: '',
    materialType: '',
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    remarks: '',
  });

  const loadData = async () => {
    if (!token) return;
    try {
      const [supplierResponse, purchaseList] = await Promise.all([
        allSuppliers(token),
        getScrapPurchases(false, token),
      ]);
      const supplierList = Array.isArray(supplierResponse)
        ? supplierResponse
        : supplierResponse?.suppliers || [];
      setSuppliers(supplierList);
      setPurchases(Array.isArray(purchaseList) ? purchaseList : []);
    } catch (error: any) {
      if (error.message?.includes('No supplier found')) {
        setSuppliers([]);
      } else {
        toast.error(error.message || 'Failed to load scrap purchases');
      }
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
      await createScrapPurchase(
        {
          supplier: form.supplier,
          materialType: form.materialType,
          quantity: Number(form.quantity),
          unit: form.unit,
          unitPrice: Number(form.unitPrice),
          remarks: form.remarks || undefined,
        },
        token,
      );
      toast.success('Scrap purchase recorded');
      setForm({
        supplier: '',
        materialType: '',
        quantity: '',
        unit: 'kg',
        unitPrice: '',
        remarks: '',
      });
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create scrap purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Scrap Purchase</h1>
        <p className="text-muted-foreground">
          Step 1: Buy scrap material from suppliers (Pakistan)
        </p>
      </div>

      {suppliers.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No suppliers found. Add a supplier first from{' '}
            <a href="/dashboard/suppliers" className="text-primary underline">
              Suppliers
            </a>{' '}
            before recording scrap purchase.
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>New Scrap Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.nameDenomination}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Material Type</Label>
              <Input
                placeholder="e.g. Copper Scrap, Iron Scrap"
                value={form.materialType}
                onChange={(e) =>
                  setForm({ ...form, materialType: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Unit Price (Rs)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Remarks</Label>
              <Input
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Record Scrap Purchase'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Purchase No</th>
                <th className="p-2">Supplier</th>
                <th className="p-2">Material</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Remaining</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id} className="border-b">
                  <td className="p-2">{purchase.purchaseNo}</td>
                  <td className="p-2">{purchase.supplier?.nameDenomination}</td>
                  <td className="p-2">{purchase.materialType}</td>
                  <td className="p-2">
                    {purchase.quantity} {purchase.unit}
                  </td>
                  <td className="p-2">
                    {purchase.remainingQuantity} {purchase.unit}
                  </td>
                  <td className="p-2">
                    {formatCurrency(purchase.totalAmount)}
                  </td>
                  <td className="p-2">{purchase.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
