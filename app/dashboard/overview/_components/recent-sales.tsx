import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/currency';

type Receipt = {
  _id?: string;
  ticketNumber?: string;
  customer?: { nameDenomination?: string; firstName?: string; lastName?: string };
  totalAmount_VatIncluded?: number;
  createdAt?: string;
  employee?: { name?: string };
};

function getCustomerName(receipt: Receipt) {
  if (receipt.customer?.nameDenomination) {
    return receipt.customer.nameDenomination;
  }
  const first = receipt.customer?.firstName || '';
  const last = receipt.customer?.lastName || '';
  return `${first} ${last}`.trim() || 'Walk-in Customer';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function RecentSales({
  receipts = [],
  loading = false,
}: {
  receipts?: Receipt[];
  loading?: boolean;
}) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading sales...</p>;
  }

  if (!receipts.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No sales yet this month. Complete a POS sale to see it here.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {receipts.map((receipt) => {
        const customerName = getCustomerName(receipt);
        return (
          <div key={receipt._id || receipt.ticketNumber} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(customerName)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{customerName}</p>
              <p className="text-sm text-muted-foreground">
                {receipt.ticketNumber || 'Receipt'}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {formatCurrency(receipt.totalAmount_VatIncluded || 0)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
