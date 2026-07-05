export function formatBrusselsDate() {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Brussels",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
}


export const customersTableHTMLGenerator = (customers: any) => {

  if (!customers.length) return null
  const todayDate = formatBrusselsDate()
  return `
    <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="padding: 1.5rem 1rem 1.5rem 1rem;">
    
    <p style="font-size: 16px; font-weight: 700;">List of customers</p>
    <p style="font-size: 14px;">${todayDate}</p>
    
    <table style="border-collapse: collapse;  table-layout: fixed; font-size: 10px;">
      <thead>
        <tr style="border-bottom: 2px solid #000;">
          <th style="padding: 6px; width: 15%; text-align: left;">Name</th>
          <th style="padding: 6px; width: 25%; text-align: left;">Adresse</th>
          <th style="padding: 6px; width: 15%; text-align: left;">Code</th>
          <th style="padding: 6px; width: 15%; text-align: left;">City</th>
           <th style="padding: 6px; width: 15%; text-align: left;">EO-ID</th>
            <th style="padding: 6px; width: 15%; text-align: left;">F-ID</th>
          <th style="padding: 6px; width: 15%; text-align: left;">N° VAT</th>
          <th style="padding: 6px; width: 15%; text-align: left;">Tel</th>
        </tr>
      </thead>
    
      <tbody>
      ${customers?.map((customer: any) => `
        <tr>
          <td style="padding: 6px; text-align: left;">${customer.nameDenomination ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${customer.billingAddress?.address ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${customer.billingAddress?.zipCode ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${customer.billingAddress?.city?.cityName ?? '---'}</td>
           <td style="padding: 6px; text-align: left;">${customer?.EOID ?? '---'}</td>
            <td style="padding: 6px; text-align: left;">${customer?.FID ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${customer.vatNumber ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${customer.tel1 ?? customer.tel2 ?? '---'}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    </div>
    </div>`
}

export const suppliersTableHTMLGenerator = (suppliers: any) => {

  if (!suppliers.length) return null
  const todayDate = formatBrusselsDate()
  return `
    <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="padding: 1.5rem 1rem 1.5rem 1rem;">
    
    <p style="font-size: 16px; font-weight: 700;">List of suppliers</p>
    <p style="font-size: 14px;">${todayDate}</p>
    
    <table style="border-collapse: collapse;  table-layout: fixed; font-size: 10px;">
      <thead>
        <tr style="border-bottom: 2px solid #000;">
          <th style="padding: 6px; width: 15%; text-align: left;">Name</th>
          <th style="padding: 6px; width: 15%; text-align: left;">N° VAT</th>
          <th style="padding: 6px; width: 15%; text-align: left;">Account Number</th>
          <th style="padding: 6px; width: 25%; text-align: left;">Adresse</th>
          <th style="padding: 6px; width: 15%; text-align: left;">Code</th>
          <th style="padding: 6px; width: 15%; text-align: left;">City</th>
          <th style="padding: 6px; width: 15%; text-align: left;">Tel</th>
        </tr>
      </thead>
    
      <tbody>
      ${suppliers?.map((supplier: any) => `
        <tr>
          <td style="padding: 6px; text-align: left;">${supplier.nameDenomination ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${supplier.vatNumber ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${supplier?.accountNumber ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${supplier.address ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${supplier.zipCode ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${supplier.city?.cityName ?? '---'}</td>
          <td style="padding: 6px; text-align: left;">${supplier.tel1 ?? supplier.tel2 ?? '---'}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    </div>
    </div>`
}


export const singleCustomerDetails = (customer: any) => {

  if (!customer) return null

  return ` <div style="max-width:700px; margin:40px auto; background-color:#ffffff; border:1px solid #e0e0e0; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:Arial, Helvetica, sans-serif;">

    <div style="padding:20px 30px; border-bottom:1px solid #eaeaea;">
      <h2 style="margin:0; color:#2c3e50; font-size:22px;">
        Customer Information
      </h2>
    </div>

    <div style="padding:30px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"> 
        <tr>
          <td style="padding:12px 10px; font-size:14px; color:#555; font-weight:bold;">
            Name - Dénomination
          </td>
          <td style="padding:12px 10px; font-size:14px; color:#2c3e50;">
           ${customer.nameDenomination ?? '---'}
          </td>
        </tr>

        <tr>
          <td style="padding:12px 10px; font-size:14px; color:#555; width:40%; font-weight:bold;">
            Customer N°
          </td>
          <td style="padding:12px 10px; font-size:14px; color:#2c3e50;">
            ${customer.customerCode ?? '---'}
          </td>
        </tr>

        <tr>
            <td style="padding:12px 10px; font-size:14px; color:#555; font-weight:bold;">
                VAT Number
            </td>
            <td style="padding:12px 10px; font-size:14px; color:#2c3e50;">
                ${customer.vatNumber ?? '---'}
            </td>
        </tr>

        <tr>
            <td style="padding:12px 10px; font-size:14px; color:#555; font-weight:bold;">
                EO-ID
            </td>
            <td style="padding:12px 10px; font-size:14px; color:#2c3e50;">
                ${customer.EOID ?? '---'}
            </td>
        </tr>


        <tr>
          <td style="padding:12px 10px; font-size:14px; color:#555; font-weight:bold;">
            F-ID
          </td>
          <td style="padding:12px 10px; font-size:14px; color:#2c3e50;">
            ${customer.FID ?? '---'}
          </td>
        </tr>

      </table>
    </div>

    <div style="padding:15px 30px; border-top:1px solid #eaeaea; background-color:#fafafa; border-radius:0 0 6px 6px;">
      <p style="margin:0; font-size:12px; color:#95a5a6; text-align:center;">
        This document is system-generated
      </p>
    </div>

  </div>`

} 