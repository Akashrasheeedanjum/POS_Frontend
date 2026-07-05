export const invoiceTable = `<table id="invoiceTable" style="width: 100%; border-collapse: collapse; min-width: 500px;">
  <thead>
    <tr style="background-color: #dcb7a6; color: #261a15; font-size: 12px;">
      <th style="border: 1px solid #e5e7eb; padding: 4px; text-align: left;">Description</th>
      <th style="border: 1px solid #e5e7eb; padding: 4px; text-align: right; width: 80px;">QUANTITÉ</th>
      <th style="border: 1px solid #e5e7eb; padding: 4px; text-align: right; width: 100px;">PRIX UNIT.</th>
      <th style="border: 1px solid #e5e7eb; padding: 4px; text-align: right; width: 100px;">MONTANT TVA</th>
    </tr>
  </thead>
  <tbody style="font-size: 12px;">
    <tr>
      <td style="border: 1px solid #e5e7eb; padding: 4px;">INSTALLATION LOGICIEL DATA-CONCEPT GESTION STOCK</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: right;">1</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: right;">895,00 €</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: right;">895,00 €</td>
    </tr>
    <tr>
      <td style="border: 1px solid #e5e7eb; padding: 4px;">CONFIGURATION POSTES AVEC IMPRIMANTES</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: right;">1</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: right;">200,00 €</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: right;">200,00 €</td>
    </tr>
  </tbody>
</table>
`;

export const vatTable = `<table id="vatTable" style="border-collapse: collapse; font-size: 12px; min-width: 150px;">
  <thead>
    <tr style="background-color: #dcb7a6; color: #261a15;">
      <th style="border: 1px solid #e5e7eb; padding: 4px; width: 50px;">TVA</th>
      <th style="border: 1px solid #e5e7eb; padding: 4px; width: 100px;">BASE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: center;">21%</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: center;">1.095,00 €</td>
    </tr>
    <tr>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: center;">6%</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: center;">0,00 €</td>
    </tr>
    <tr>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: center;">0%</td>
      <td style="border: 1px solid #e5e7eb; padding: 4px; text-align: center;">0,00 €</td>
    </tr>
  </tbody>
</table>
`;


// ......................................................................................................

export const confirmInvoiceTableDemo = `<table id="confirmInvoiceTableDemo" style="width:100%; border-collapse:collapse; border: 1px solid black;">
      <thead>
        <tr style="background:#f2f2f2; background-color: #3b3b3b">
          <th style="padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Description</th>
          <th style="padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Px Unit.HT</th>
          <th style="padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Quantité</th>
          <th style="padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">Total HT</th>
          <th style="padding:4px; text-align:left; border:1px solid black; border-bottom: none; color: white;">TVA</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">AUSTIN 100'S RED 20/10 AUSTIN 100'S RED 20/10AUSTIN 100'S RED 20/10</td>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none;">143.65</td>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none;">2</td>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none;">287.3</td>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none;">21%</td>

        </tr>
      </tbody>
    </table>`;


export const confirmPaymentMethodsDemo = `<table id="confirmPaymentMethodsDemo" style=" border-collapse:collapse; border: 1px solid black;">
      <thead>
        <tr style="background-color: #3b3b3b ">
          <th style="padding:4px; text-align: center; border:1px solid black; border-bottom: none; color: white;">Payment Methods</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">6108......Bank / 3000</td>
        </tr>
        <tr>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">6108......Bank / 6000</td>
        </tr>
        <tr>
          <td style="padding:4px; border:1px solid black; border-bottom: none; border-top: none; width: 50%;">8108......Bank / 12000</td>
        </tr>
      </tbody>
    </table>`