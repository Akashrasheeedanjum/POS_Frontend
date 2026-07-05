'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/currency';

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  purchases: {
    label: 'Purchases',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type ChartRow = {
  date: string;
  sales: number;
  purchases: number;
  netPnl?: number;
};

export function BarGraph({
  data = [],
  loading = false,
}: {
  data?: ChartRow[];
  loading?: boolean;
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('sales');

  const total = React.useMemo(
    () => ({
      sales: data.reduce((acc, curr) => acc + (curr.sales || 0), 0),
      purchases: data.reduce((acc, curr) => acc + (curr.purchases || 0), 0),
    }),
    [data],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales vs Purchases</CardTitle>
          <CardDescription>
            Daily totals in Rs for {new Date().toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </div>
        <div className="flex">
          {(['sales', 'purchases'] as const).map((key) => (
            <button
              key={key}
              type="button"
              data-active={activeChart === key}
              className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-2xl">
                {loading ? '...' : formatCurrency(total[key])}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex h-[280px] items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-muted-foreground">
            No data yet. Record scrap purchase or POS sale to see chart.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-PK', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-PK')
                    }
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
