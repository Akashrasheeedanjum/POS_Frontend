"use client"

import { useState, useRef, useEffect } from "react"
import { Printer, Settings, Check, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import DocumentTemplate from "./document-template"
import { getAllTemplates, getSelectedTemplate, selectATemplate } from "@/lib/actions/printerSettings.actions"
import { toast } from "sonner"
import Handlebars from 'handlebars';
import { invoiceTable, vatTable, confirmInvoiceTableDemo, confirmPaymentMethodsDemo } from "./constants"
import { openPrintTab, templateGenerator } from "./Helper/printFunction"

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const year = today.getFullYear();

const formattedDate = `${day}/${month}/${year}`;

    const staticData = {
    companyName: 'WAAT BRO',
    companyStreetAddress: 'RUE BROGNIEZ 88',
    companyCityAddress: '1070 ANDERLECHT BRUSSELS',
    companyCountry: 'BELGIUM',
    companyVatNumber: 'BE 1009 . 105 . 106',
    companyEmail: 'WAATBRO@GMAIL.COM',
    companyTelphone: '0032 465 35 22 78',
    companyBankName1: 'BNP',
    companyBankAccount1: 'BE 1234 5678 9101',
    companyBankName2: 'BELFUIS',
    companyBankAccount2: 'BE 1234 5678 8101',
    companyBankName3: 'KBC',
    companyBankAccount3: 'BE 1234 5678 7101',
    companyBankName4: 'FINTR',
    companyBankAccount4: 'BE 1234 5678 6101',
    customerCode: '22055443',
    factureNumber: 'VFHGLY25-068907',
    customerName: 'TAZ SRL',
    customerStreetAddress: 'RUE DEMIDI 12',
    customerCityAddress: '1060 SAINT GILLES BRUSSELS',
    customerCountry: 'BELGIUM',
    customerVatNumber: 'cust vatNum',
    customerFOID: 'FO 14 1287bdejwi',
    customerEID: 'EID 17 f7482b327',
    customerNumber: '0032 217 38 44 87',
    vatRat1: '0%',
    vatRat2: '21%',
    vatRat3: '7%',
    vatRat4: '10%',
    base1: '0',
    base2: '287.3',
    base3: '0',
    base4: '0',
    totalRemise: '0.000',
    totalHT: '1289.899',
    TVA: '8.590',
    totalTTC: '1298.490',
    date: formattedDate,
  }


  export interface Template{
    _id: string
    name: string
    templateContent: string
    selected: boolean
  }
export default function PrinterSettings() {
  const [printerSettings, setPrinterSettings] = useState({
    a4Printer: "Printer undefined",
    labelPrinter: "Microsoft Print to PDF",
    ticketPrinter: "Serial printer on COM port",
    port: "COM1",
    speed: "9600",
    paperFormat: "Reçu standard : Largeur : 80 mm",
    leftMargin: "0",
    printVAT: true,
    printUnitPrice: true,
    ticketMessage: "<< MERCI DE VOTRE VISITE >>",
    printLogo: true,
    commandType: "gs",
  })

  const [selectedTemplate, setSelectedTemplate] = useState<Template|undefined>()
  const [confirmedTemplate, setConfirmedTemplate] = useState<Template>()
  const [isConfirming, setIsConfirming] = useState(false)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  // const [tablesContents, setTablesContents] = useState<string[]>([invoiceTable, vatTable])
  const [tablesContents, setTablesContents] = useState<any>([confirmInvoiceTableDemo, confirmPaymentMethodsDemo])
  const [tempData, setTempData] = useState(staticData)

  const [compiledTemplates, setCompiledTemplates] = useState<{ [name: string]: string }>({});

    const prepareDataForTemplate = {
    data: staticData,
    confirmInvoiceTableDemo: tablesContents[0],
    confirmPaymentMethodsDemo:tablesContents[1] 
  }

  const { theme, setTheme } = useTheme()
  const documentRef = useRef<HTMLDivElement>(null)

  const fetchAllTemplates = async () => {
    try {
      const data = await getAllTemplates();      
      setAllTemplates(data);
      const selected = data.find((temp:Template) => temp?.selected === true);
      setSelectedTemplate(selected);
      setConfirmedTemplate(selected);

          // Compile all templates
    const compiled: { [name: string]: string } = {};
    for (const temp of data) {
      const compiledHTML = await templateGenerator(prepareDataForTemplate, temp);  // dynamicData & tablesContents must be ready here
      compiled[temp.name] = compiledHTML;   //it would place the compiledHTML as ["Template 1": "compiledHTML"]
    }
    setCompiledTemplates(compiled);
    } catch (error) {
      console.error("Error fetching All templates:", error)
      toast.error("Failed to fetch All templates")  
    }
  }

  useEffect(() => {
    fetchAllTemplates();
  }, [])
  
  const tablesContent = (confirmInvoiceTableDemo:string, confirmPaymentMethodsDemo:string) => {
    // setTablesContents([confirmInvoiceTableDemo, confirmPaymentMethodsDemo])
  }

    // const templateGenerator = async(dynamicData:any, template:Template|undefined) => {  
    //   /*this template would include the header and footer of the inovice design and the actual tables 
    //   would be fetched as they are present on the page and their HTML would be pasted here, moreover
    //   the dynamic values of the template design would be pasted using data object */
    //   // const invoiceTableContent = document.getElementById('invoiceTable')?.outerHTML || ''
    //   // const vatTableContent = document.getElementById('vatTable')?.outerHTML || ''
  
    //   // const result = await getSelectedTemplate()   // Fetch the template string
        
    //   // console.log('templateString', result?.templateContent)
    //   // Step 1: Prepare a full data object
    //     //   const templateData = {
    //     //     // data: {...tempData},               // all dynamic values like clientName, date, etc
    //     //     data: dynamicData,
    //     //     confirmInvoiceTableDemo:tablesContents[0],         // table html
    //     //     confirmPaymentMethodsDemo:tablesContents[1]              // table html
    //     // };


        
    //     /*As my template from database uses
    //     {{data.head}}
    //     {{data.desc}}
    //     {{data.clientName}}
    //     So Handlebars expects the structure like:
    //     {
    //     "data": {
    //       "head": "Invoice",
    //       "desc": "B° 20170001",
    //       ...
    //     },
    //     "invoiceTableContent": "...",
    //     "vatTableContent": "..."
    //     }
    //     */
  
    //         // Step 2: Compile template
    //   const templateCompiler = Handlebars.compile(template?.templateContent);
  
    //   // Step 3: Pass data to compiled template
    //   // const finalHTML = templateCompiler(templateData);
    //   const finalHTML = templateCompiler(dynamicData);
      
    
  
    //   return finalHTML;
    
    // }

    // const openPrintTab = async() => {
    // const openPrintTab = async(dataForTemplate:any, selectedTemplate:any) => {
      


    // const printTab = window.open('Invoice', '_blank');
    //   // const printTab = window.open('', '_blank'); // Open in a new tab
      
    //   // const content = document.getElementById('printableContent')?.innerHTML || '';
    //   const content = await templateGenerator(dataForTemplate, selectedTemplate)
  
    //   // console.log('generated content', content)
    //   if (!printTab) return; // Popup blocked
    
    //   // Create a unique ID to match messages
    //   const sessionId = Math.random().toString(36).substr(2, 9);
    
    //   // Message listener
    //   const handleMessage = (event:any) => {
    //     if (event.data?.type === 'print-complete' && event.data?.sessionId === sessionId) {
    //       printTab.close();
    //       window.removeEventListener('message', handleMessage);
    //     }
    //   };
    
    //   window.addEventListener('message', handleMessage);
    
    //   // Write HTML content into the new tab
    //   printTab.document.write(`
    //     <html>
    //       <head>
    //         <meta charset="UTF-8" />
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    //         <style>
    //          @media print {
    //            div[style*="overflow-x: auto"] {
    //              overflow: visible !important;
    //            }
    //          }
    //         </style>
    //       </head>
    //       <body>
    //         ${content}
    //         <script>
    //           // Notify opener after print
    //       window.addEventListener('beforeprint', function() {
    //         document.body.style.overflow = 'hidden';
    //       });
  
    //       window.addEventListener('afterprint', function() {
    //         document.body.style.overflow = '';
    //         if (window.opener) {
    //           window.opener.postMessage({
    //             type: 'print-complete',
    //             sessionId: '${sessionId}'
    //           }, '*');
    //         }
    //       });
    
    //           // Fallback in case onafterprint doesn't trigger (auto after 30s)
    //           setTimeout(() => {
    //             if (window.opener) {
    //               window.opener.postMessage({
    //                 type: 'print-complete',
    //                 sessionId: '${sessionId}'
    //               }, '*');
    //             }
    //           }, 30000);
    //         </script>
    //       </body>
    //     </html>
    //   `);
    
    //   printTab.document.close();
    
    //   // Slight delay to allow CSS to load before printing
    //   setTimeout(() => {
    //     printTab.print();
    //   }, 200);
    // };

  const handleConfirmTemplate = async() => {
    try {
      setIsConfirming(true)
      await selectATemplate(selectedTemplate?._id)
      // Simulate a brief delay for visual feedback
      setTimeout(() => {
        setConfirmedTemplate(selectedTemplate)
        setIsConfirming(false)
      }, 500)
      toast.success(`${selectedTemplate?.name} Selected Successfully`) 
    } catch (error) {
      console.error("Error while setting Template:", error)
      toast.error(`Failed to set Template: ${error}`) 
    }

  }

  const handleChange = (field: string, value: string | boolean) => {
    setPrinterSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleChangeTemplateSelection =(selected:Template|undefined) => {
    console.log('selection changed', selected)
    setSelectedTemplate(selected);
  }


  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Printer Configuration</h1>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-6">
              <Printer className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Printers</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] items-center gap-4">
                <Label htmlFor="a4-printer">A4 printer</Label>
                <Select value={printerSettings.a4Printer} onValueChange={(value) => handleChange("a4Printer", value)}>
                  <SelectTrigger id="a4-printer">
                    <SelectValue placeholder="Select printer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Printer undefined">Printer undefined</SelectItem>
                    <SelectItem value="HP LaserJet">HP LaserJet</SelectItem>
                    <SelectItem value="Canon Pixma">Canon Pixma</SelectItem>
                    <SelectItem value="Epson WorkForce">Epson WorkForce</SelectItem>
                    <SelectItem value="Microsoft Print to PDF">Microsoft Print to PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] items-center gap-4">
                <Label htmlFor="label-printer">Label printer</Label>
                <Select
                  value={printerSettings.labelPrinter}
                  onValueChange={(value) => handleChange("labelPrinter", value)}
                >
                  <SelectTrigger id="label-printer">
                    <SelectValue placeholder="Select printer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Microsoft Print to PDF">Microsoft Print to PDF</SelectItem>
                    <SelectItem value="DYMO LabelWriter">DYMO LabelWriter</SelectItem>
                    <SelectItem value="Brother QL-800">Brother QL-800</SelectItem>
                    <SelectItem value="Zebra ZD410">Zebra ZD410</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] items-center gap-4">
                <Label htmlFor="ticket-printer">Ticket printer</Label>
                <Select
                  value={printerSettings.ticketPrinter}
                  onValueChange={(value) => handleChange("ticketPrinter", value)}
                >
                  <SelectTrigger id="ticket-printer">
                    <SelectValue placeholder="Select printer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serial printer on COM port">Serial printer on COM port</SelectItem>
                    <SelectItem value="Epson TM-T20III">Epson TM-T20III</SelectItem>
                    <SelectItem value="Star TSP100">Star TSP100</SelectItem>
                    <SelectItem value="Bixolon SRP-350III">Bixolon SRP-350III</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[150px_100px_80px_100px] items-center gap-4">
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-1 items-center gap-4">
                  <Label htmlFor="port">Port</Label>
                  <Select value={printerSettings.port} onValueChange={(value) => handleChange("port", value)}>
                    <SelectTrigger id="port">
                      <SelectValue placeholder="Port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COM1">COM1</SelectItem>
                      <SelectItem value="COM2">COM2</SelectItem>
                      <SelectItem value="COM3">COM3</SelectItem>
                      <SelectItem value="COM4">COM4</SelectItem>
                      <SelectItem value="LPT1">LPT1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[120px_1fr] md:grid-cols-1 items-center gap-4 md:col-span-3">
                  <Label htmlFor="speed">Speed</Label>
                  <Select value={printerSettings.speed} onValueChange={(value) => handleChange("speed", value)}>
                    <SelectTrigger id="speed">
                      <SelectValue placeholder="Speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9600">9600</SelectItem>
                      <SelectItem value="19200">19200</SelectItem>
                      <SelectItem value="38400">38400</SelectItem>
                      <SelectItem value="57600">57600</SelectItem>
                      <SelectItem value="115200">115200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] items-center gap-4">
                <Label htmlFor="paper-format">Paper format</Label>
                <Select
                  value={printerSettings.paperFormat}
                  onValueChange={(value) => handleChange("paperFormat", value)}
                >
                  <SelectTrigger id="paper-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reçu standard : Largeur : 80 mm">Reçu standard : Largeur : 80 mm</SelectItem>
                    <SelectItem value="A7 Largeur : 75 mm">A7 Largeur : 75 mm</SelectItem>
                    <SelectItem value="Reçu petit format: Largeur : 56 mm">
                      Reçu petit format: Largeur : 56 mm
                    </SelectItem>
                    <SelectItem value="A8 Largeur : 53 mm">A8 Largeur : 53 mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] items-center gap-4">
                <Label htmlFor="left-margin">Left margin</Label>
                <Input
                  id="left-margin"
                  type="number"
                  value={printerSettings.leftMargin}
                  onChange={(e) => handleChange("leftMargin", e.target.value)}
                  className="w-20"
                />
              </div>

              <div className="grid grid-cols-[1fr_80px] items-center gap-4">
                <Label htmlFor="print-vat">Print the VAT details on the receipt</Label>
                <div className="flex justify-end">
                  <Switch
                    id="print-vat"
                    checked={printerSettings.printVAT}
                    onCheckedChange={(checked) => handleChange("printVAT", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_80px] items-center gap-4">
                <Label htmlFor="print-unit-price">Print the unit price on the receipt</Label>
                <div className="flex justify-end">
                  <Switch
                    id="print-unit-price"
                    checked={printerSettings.printUnitPrice}
                    onCheckedChange={(checked) => handleChange("printUnitPrice", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] items-start gap-4">
                <Label htmlFor="ticket-message">End of ticket message</Label>
                <Input
                  id="ticket-message"
                  value={printerSettings.ticketMessage}
                  onChange={(e) => handleChange("ticketMessage", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-[1fr_80px] items-center gap-4">
                <Label htmlFor="print-logo">Print the logo in memory (serial printer)</Label>
                <div className="flex justify-end">
                  <Switch
                    id="print-logo"
                    checked={printerSettings.printLogo}
                    onCheckedChange={(checked) => handleChange("printLogo", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[1fr] gap-4">
                <RadioGroup
                  value={printerSettings.commandType}
                  onValueChange={(value) => handleChange("commandType", value)}
                  className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fs" id="fs-command" />
                    <Label htmlFor="fs-command">FS command</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gs" id="gs-command" />
                    <Label htmlFor="gs-command">GS command</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Print templates of documents</h2>
                <button
            onClick={() => openPrintTab(prepareDataForTemplate, selectedTemplate)}
            // onClick={templateGenerator}
            className="relative -right-5 bg-[#DCB7A6] text-black px-2 py-1 rounded-md"
          >
            Demo Print
          </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              {allTemplates?.length > 0 && (
              <Select 
              value={selectedTemplate?.name} 
              onValueChange={(val) => {
                const selected = allTemplates.find((temp) => temp.name === val);
                handleChangeTemplateSelection(selected)
                
              }}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {allTemplates.map((temp) => (
                    <SelectItem 
                    key={temp?._id}
                    value={temp?.name}>{temp?.name}</SelectItem>

                  ))}
                </SelectContent>
              </Select>
              )}

              <Button
                onClick={handleConfirmTemplate}
                disabled={isConfirming || selectedTemplate === confirmedTemplate}
                className="relative w-full md:w-auto"
              >
                {isConfirming ? (
                  <>
                    <span className="mr-2">•••</span>
                    Confirming...
                  </>
                ) : selectedTemplate === confirmedTemplate ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Template Selected
                  </>
                ) : (
                  "Use this template"
                )}
              </Button>
            </div>

            <div className="border rounded-md p-2 md:p-4 shadow-sm bg-card overflow-x-auto" ref={documentRef}>
              <DocumentTemplate
                templateName={confirmedTemplate?.name ?? ''}
                showVAT={printerSettings.printVAT}
                showUnitPrice={printerSettings.printUnitPrice}
                ticketMessage={printerSettings.ticketMessage}
                showLogo={printerSettings.printLogo}
                getTablesContent={(confirmInvoiceTableDemo, confirmPaymentMethodsDemo) => tablesContent(confirmInvoiceTableDemo, confirmPaymentMethodsDemo)}
                templateContent={compiledTemplates[selectedTemplate?.name ?? '']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

