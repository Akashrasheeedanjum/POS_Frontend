export const receiptTableHTMLGenerator = (cartData:any) =>{
      if(!cartData.length) return null
    return `<table id="confirmInvoiceTableDemo" style="width:100%; border-collapse:collapse; border: 1px solid black;">
        <thead>
          <tr style="background:#f2f2f2; background-color: #3b3b3b">
            <th style="font-size: 10px; padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Description</th>
            <th style="font-size: 10px; padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Px Unit.HT</th>
            <th style="font-size: 10px; padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Quantité</th>
            <th style="font-size: 10px; padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Total HT</th>
            <th style="font-size: 10px; padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">TVA</th>
          </tr>
        </thead>
        <tbody>
        ${cartData.map((singleData:any) =>`
          <tr>
            <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">${singleData.nameAtPurchase}</td>
            <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none;">${singleData.singleUnitPrice_vatExclude}</td>
            <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none;">${singleData.quantityAtPurchase}</td>
            <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none;">${(singleData.singleUnitPrice_vatExclude * singleData.quantityAtPurchase).toFixed(2)}</td>
            <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none;">${singleData.rateOfVat_atPurchase}%</td>
          </tr>
          `).join("")}
  
        </tbody>
      </table>`;
    }
  
  export function formatDate(utcDateString:any) {
  const date = new Date(utcDateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
  
export function formatTime(info: any) {
  const dateString = info?.getValue();
  const date = new Date(dateString);

  if (isNaN(date?.getTime())) return "";

  const hours = String(date?.getHours()).padStart(2, "0");
  const minutes = String(date?.getMinutes()).padStart(2, "0");
  const seconds = String(date?.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`; // 24-hour format
}

export const paymentsTableHTMLGenerator = (paymentMethods:any) => {
    if(!paymentMethods.length) return null

    return `<table id="confirmPaymentMethodsDemo" style=" border-collapse:collapse; border: 1px solid black;">
      <thead>
        <tr style="background-color: #3b3b3b ">
          <th style="font-size: 10px; padding:4px; text-align: center; border:1px solid black; border-bottom: none; color: white;">Method</th>
          <th style="font-size: 10px; padding:4px; text-align: center; border:1px solid black; border-bottom: none; color: white;">Amount</th>
          <th style="font-size: 10px; padding:4px; text-align: center; border:1px solid black; border-bottom: none; color: white;">Date</th>
        </tr>
      </thead>
      <tbody>
      ${paymentMethods.map((method:any) => `
        <tr>
          <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">${method.paymentMethod_name}</td>
          <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">${method.paymentAmount}</td>
          <td style="font-size: 10px; padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">${formatDate(method.paymentDate)}</td>
        </tr>
        `).join("")}
        
      </tbody>
    </table>`
  }