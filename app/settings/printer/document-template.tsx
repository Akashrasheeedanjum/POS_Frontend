import { useEffect } from "react"

interface DocumentTemplateProps {
    templateName: string
    showVAT: boolean
    showUnitPrice: boolean
    ticketMessage: string
    showLogo: boolean,
    getTablesContent: (invoiceTableContent:string, vatTableContent:string) => void,
    templateContent?: string;
  }
  
  export default function DocumentTemplate({
    templateName,
    showVAT,
    showUnitPrice,
    ticketMessage,
    showLogo,
    getTablesContent,
    templateContent
  }: DocumentTemplateProps) {

    useEffect(() => {
      const confirmInvoiceTableDemo = document.getElementById('confirmInvoiceTableDemo')?.outerHTML || ''
      const confirmPaymentMethodsDemo = document.getElementById('confirmPaymentMethodsDemo')?.outerHTML || ''

      getTablesContent(confirmInvoiceTableDemo, confirmPaymentMethodsDemo)
    }, [])


    if (templateContent) {
      return (
        <div dangerouslySetInnerHTML={{ __html: templateContent }} />
      );
    }

    // fallback default layout
    return (
      <div className="w-full max-w-[600px] mx-auto font-sans text-sm overflow-x-auto">
        {showLogo && (
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground px-3 py-1 text-center">
              <div className="font-bold">Facture</div>
              <div className="text-xs">N° 20170001</div>
            </div>
          </div>
        )}
  
        <div className="mb-4">
          <div className="text-right text-xs">
            <div>Date: 28/03/2025</div>
            <div>Page: 1</div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="font-bold mb-1">Data-Concept SPRL</div>
            <div className="text-xs text-muted-foreground">
              <div>Avenue Boileau 27, 1040 Bruxelles</div>
              <div>TVA: BE 0123.456.789</div>
              <div>Tel: 02/555-12-12</div>
              <div>info@data-concept.be</div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="font-bold mb-1">CLIENT SAISON</div>
            <div className="text-xs text-muted-foreground">
              <div>Avenue Louise 345</div>
              <div>1050 - BRUXELLES</div>
              <div>TVA: BE 0987.654.321</div>
            </div>
          </div>
        </div>
  
        {/* Responsive Table with horizontal scroll on small screens */}
        <div 
        className="overflow-x-auto mb-6">
          <table id="invoiceTable" className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr 
             
              style={{backgroundColor: '#dcb7a6', color: 'color: #261a15', fontSize: '12px'}}
              >
                <th className="border border-border p-1 text-left">Description</th>
                <th className="border border-border p-1 text-right w-[80px]">QUANTITÉ</th>
                <th className="border border-border p-1 text-right w-[100px]">PRIX UNIT.</th>
                <th className="border border-border p-1 text-right w-[100px]">MONTANT TVA</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr>
                <td className="border border-border p-1">INSTALLATION LOGICIEL DATA-CONCEPT GESTION STOCK</td>
                <td className="border border-border p-1 text-right">1</td>
                <td className="border border-border p-1 text-right">{showUnitPrice ? "895,00 €" : "-"}</td>
                <td className="border border-border p-1 text-right">895,00 €</td>
              </tr>
              <tr>
                <td className="border border-border p-1">CONFIGURATION POSTES AVEC IMPRIMANTES</td>
                <td className="border border-border p-1 text-right">1</td>
                <td className="border border-border p-1 text-right">{showUnitPrice ? "200,00 €" : "-"}</td>
                <td className="border border-border p-1 text-right">200,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          {/* Responsive Tax Table with horizontal scroll on small screens */}
          <div className="overflow-x-auto">
            <table id="vatTable" className="border-collapse text-xs min-w-[150px]">
              <thead>
                <tr 
                
                style={{backgroundColor: '#dcb7a6', color: 'color: #261a15'}}
                >
                  <th className="border border-border p-1 w-[50px]">TVA</th>
                  <th className="border border-border p-1 w-[100px]">BASE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-1 text-center">21%</td>
                  <td className="border border-border p-1 text-center">1.095,00 €</td>
                </tr>
                <tr>
                  <td className="border border-border p-1 text-center">6%</td>
                  <td className="border border-border p-1 text-center">0,00 €</td>
                </tr>
                <tr>
                  <td className="border border-border p-1 text-center">0%</td>
                  <td className="border border-border p-1 text-center">0,00 €</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="text-right">
            <div className="font-bold mb-1">Total TTC</div>
            <div className="text-xl font-bold">1095,00 €</div>
            <div className="text-xs text-muted-foreground">Dont TVA: 190,00 €</div>
          </div>
        </div>
  
        {showVAT && (
          <div className="text-xs text-center mb-4 text-muted-foreground">TVA intracommunautaire BE 0123.456.789</div>
        )}
  
        <div className="text-xs text-center mb-2">{ticketMessage}</div>
  
        <div className="bg-primary text-primary-foreground text-xs p-1 text-center">
          Conditions de vente: Paiement comptant. Tout retard de paiement entraîne des pénalités.
        </div>
      </div>
    )
  }
  
  