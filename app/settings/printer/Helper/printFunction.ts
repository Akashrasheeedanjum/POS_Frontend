import Handlebars from 'handlebars';

interface Template {
  _id: string;
  name: string;
  templateContent: string;
  selected: boolean;
}

export function buildFallbackReceiptHtml(dynamicData: any): string {
  const data = dynamicData?.data ?? {};
  const itemsTable = dynamicData?.confirmInvoiceTableDemo ?? '';
  const paymentsTable = dynamicData?.confirmPaymentMethodsDemo ?? '';

  return `<div style="font-family: Arial, sans-serif; max-width: 80mm; margin: 0 auto; padding: 10px; font-size: 12px; color: #111;">
    <h2 style="text-align: center; margin: 0 0 8px;">${data.companyName ?? 'Lahore POS'}</h2>
    <p style="text-align: center; margin: 0 0 12px; font-size: 11px;">
      ${data.companyStreetAddress ?? ''}<br/>
      ${data.companyCityAddress ?? ''}<br/>
      ${data.companyCountry ?? 'Pakistan'}
    </p>
    <hr style="border: none; border-top: 1px dashed #999; margin: 10px 0;" />
    <p style="margin: 4px 0;"><strong>Receipt No:</strong> ${data.factureNumber ?? '-'}</p>
    <p style="margin: 4px 0;"><strong>Date:</strong> ${data.date ?? ''}</p>
    <p style="margin: 4px 0;"><strong>Customer:</strong> ${data.customerName ?? ''} (${data.customerCode ?? ''})</p>
    <div style="margin: 12px 0;">${itemsTable}</div>
    <p style="margin: 4px 0; text-align: right;"><strong>Subtotal:</strong> Rs ${data.totalHT ?? '0.00'}</p>
    <p style="margin: 4px 0; text-align: right;"><strong>GST:</strong> Rs ${data.TVA ?? '0.00'}</p>
    <p style="margin: 8px 0; text-align: right; font-size: 14px;"><strong>Total:</strong> Rs ${data.totalTTC ?? '0.00'}</p>
    <div style="margin: 12px 0;">${paymentsTable}</div>
    <p style="text-align: center; margin-top: 16px; font-size: 11px;">Thank you for your business!</p>
  </div>`;
}

export const templateGenerator = async (
  dynamicData: any,
  template?: Template,
): Promise<string> => {
  if (!template?.templateContent?.trim()) {
    return buildFallbackReceiptHtml(dynamicData);
  }

  try {
    const templateCompiler = Handlebars.compile(template.templateContent);
    return templateCompiler(dynamicData);
  } catch (error) {
    console.error('Receipt template compile failed, using fallback:', error);
    return buildFallbackReceiptHtml(dynamicData);
  }
};

function buildPrintDocument(content: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Receipt</title>
    <style>
      @page { margin: 8mm; }
      body { margin: 0; padding: 0; background: #fff; }
      @media print {
        div[style*="overflow-x: auto"] { overflow: visible !important; }
      }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

function printViaHiddenFrame(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let frame = document.getElementById('pos-print-frame') as HTMLIFrameElement | null;

    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'pos-print-frame';
      frame.setAttribute('aria-hidden', 'true');
      frame.style.position = 'fixed';
      frame.style.width = '0';
      frame.style.height = '0';
      frame.style.border = '0';
      frame.style.opacity = '0';
      frame.style.pointerEvents = 'none';
      document.body.appendChild(frame);
    }

    const printWindow = frame.contentWindow;
    if (!printWindow) {
      reject(new Error('Print frame is not available'));
      return;
    }

    const cleanup = () => {
      printWindow.removeEventListener('afterprint', onAfterPrint);
    };

    const onAfterPrint = () => {
      cleanup();
      resolve();
    };

    printWindow.addEventListener('afterprint', onAfterPrint);

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (error) {
        cleanup();
        reject(error);
      }
    }, 400);

    setTimeout(() => {
      cleanup();
      resolve();
    }, 15000);
  });
}

function printViaPopup(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const printTab = window.open('', '_blank');

    if (!printTab) {
      reject(new Error('Print window blocked. Allow popups for this site.'));
      return;
    }

    printTab.document.open();
    printTab.document.write(html);
    printTab.document.close();

    const onAfterPrint = () => {
      printTab.close();
      resolve();
    };

    printTab.addEventListener('afterprint', onAfterPrint);

    setTimeout(() => {
      try {
        printTab.focus();
        printTab.print();
      } catch (error) {
        reject(error);
      }
    }, 400);

    setTimeout(() => {
      if (!printTab.closed) {
        printTab.close();
      }
      resolve();
    }, 15000);
  });
}

export const openPrintTab = async (
  dataForTemplate: any,
  selectedTemplate?: Template,
) => {
  const content = await templateGenerator(dataForTemplate, selectedTemplate);
  const html = buildPrintDocument(content);

  try {
    await printViaHiddenFrame(html);
  } catch (frameError) {
    console.warn('Iframe print failed, trying popup:', frameError);
    await printViaPopup(html);
  }
};
