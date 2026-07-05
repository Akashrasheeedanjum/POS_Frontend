import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DocPreviewModalProps {
  open:boolean;
  onClose: () => void
  htmlContent: any;
  title: string;
}

const DocPreviewModal = ({
    open,
    onClose,
    htmlContent,
    title = 'Preview'
}: DocPreviewModalProps) => {

    


const handlePrint = async () => {

    if(!htmlContent){
        toast.error('Content to print lost!');
        return;
    }
    const printTab = window.open('Invoice', '_blank');
    if (!printTab) return;

    const sessionId = Math.random().toString(36).substr(2, 9);
    
      // Message listener
      const handleMessage = (event:any) => {
        if (event.data?.type === 'print-complete' && event.data?.sessionId === sessionId) {
          printTab.close();
          window.removeEventListener('message', handleMessage);
        }
      };
    
      window.addEventListener('message', handleMessage);
    
      // Write HTML content into the new tab
      printTab.document.write(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <style>
             @media print {
               div[style*="overflow-x: auto"] {
                 overflow: visible !important;
               }
             }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              // Notify opener after print
          window.addEventListener('beforeprint', function() {
            document.body.style.overflow = 'hidden';
          });
  
          window.addEventListener('afterprint', function() {
            document.body.style.overflow = '';
            if (window.opener) {
              window.opener.postMessage({
                type: 'print-complete',
                sessionId: '${sessionId}'
              }, '*');
            }
          });
    
              // Fallback in case onafterprint doesn't trigger (auto after 30s)
              setTimeout(() => {
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'print-complete',
                    sessionId: '${sessionId}'
                  }, '*');
                }
              }, 30000);
            </script>
          </body>
        </html>
      `);
    
      printTab.document.close();
    
      // Slight delay to allow CSS to load before printing
      setTimeout(() => {
        printTab.print();
      }, 200);
}

  return (
    <>
        <Dialog 
        open={open}
        onOpenChange={onClose}
            >
              <DialogContent
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="max-w-[95vw] h-[95vh] scrollbar-custom overflow-auto p-0 ">
              <Card className="w-full border-none shadow-none bg-transparent">
                <CardHeader className="relative flex flex-row justify-between items-center bg-[#DAAC95] text-white p-3 rounded-tl-md">
                  <CardTitle className="text-black text-xl font-medium">{title}</CardTitle>
                    <Button onClick={handlePrint} variant="outline" className="absolute right-16 top-0 border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-none text-white bg-red-500">
                    Print
                  </Button>
                </CardHeader>
      
                <CardContent >
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </CardContent>
      
                {/* Action Buttons */}
                {/* <div className="absolute right-5 top-1/3 flex flex-col gap-3">
                  <Button 
                  // onClick={handleData}
                  onClick={handleSubmit}
                  size="lg">
                    <Save className="mr-2" size={18} /> {mode == 'edit'? 'Update': 'Save'}
                  </Button>
                  <Button variant="outline" className=" border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                    Specific prices
                  </Button>
                  <Button variant="outline" className=" border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                    Crédits-prepaid..
                  </Button>
                  <Button variant="outline" className=" border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                    History stock entries
                  </Button>
                </div> */}
              </Card>
            </DialogContent>
              </Dialog>
    </>
  )
}

export default DocPreviewModal
