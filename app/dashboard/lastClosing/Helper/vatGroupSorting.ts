
export function mergeVatGroups(vatGroups:any){

const grouped = Object.values(
  (Array.isArray(vatGroups) ? vatGroups : []).reduce((acc, curr) => {
    // Skip invalid entries safely
    if (!curr || typeof curr !== "object") return acc;

    const label = curr.label ?? "UNKNOWN";

    // Initialize group if not present
    if (!acc[label]) {
      acc[label] = {
        label,
        totalBase: 0,
        totalVatAmount: 0,
        totalAmount: 0,
        vatRates: new Set(),
      };
    }

    // Add numeric fields safely
    acc[label].totalBase += Number(curr.totalBase) || 0;
    acc[label].totalVatAmount += Number(curr.totalVatAmount) || 0;
    acc[label].totalAmount += Number(curr.totalAmount) || 0;

    // Add VAT rate safely
    if (typeof curr.vatRate === "number" && !isNaN(curr.vatRate)) {
      acc[label].vatRates.add(curr.vatRate);
    }

    return acc;
  }, {})
)
  .map((group:any) => ({
    label: group.label,
    totalBase: Number(group.totalBase.toFixed(2)),
    totalVatAmount: Number(group.totalVatAmount.toFixed(2)),
    totalAmount: Number(group.totalAmount.toFixed(2)),
    vatRate: Array.from(group.vatRates)
      .sort((a:any, b:any) => a - b)
      .map((r) => `${r}%`)
      .join(", ") || "N/A",
  }))
  // ✅ Sort alphabetically by label name
  .sort((a, b) => a.label.localeCompare(b.label));


return grouped
}