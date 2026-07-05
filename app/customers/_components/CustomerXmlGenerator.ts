import { formatBrusselsDate } from "./CustomerTableGenerator";

const escapeXml = (value: any) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const generateCustomersXml = (customers: any[]): string | null => {
  if (!customers || customers.length === 0) return null;

  const todayDate = formatBrusselsDate();

  const itemsXml = customers
    .map((customer) => {
      const name = customer?.nameDenomination ?? "---";
      const adresse = customer?.billingAddress?.address ?? "---";
      const code = customer?.billingAddress?.zipCode ?? "---";
      const city = customer?.billingAddress?.city?.cityName ?? "---";
      const eoid = customer?.EOID ?? "---";
      const fid = customer?.FID ?? "---";
      const vat = customer?.vatNumber ?? "---";
      const tel = customer?.tel1 ?? customer?.tel2 ?? "---";

      return `
  <Customer>
    <Name>${escapeXml(name)}</Name>
    <Adresse>${escapeXml(adresse)}</Adresse>
    <Code>${escapeXml(code)}</Code>
    <City>${escapeXml(city)}</City>
    <EOID>${escapeXml(eoid)}</EOID>
    <FID>${escapeXml(fid)}</FID>
    <VatNumber>${escapeXml(vat)}</VatNumber>
    <Tel>${escapeXml(tel)}</Tel>
  </Customer>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<CustomersList date="${escapeXml(todayDate)}">
${itemsXml}
</CustomersList>`;
};