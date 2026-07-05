    
    export const printSimpleHtml = async(tabName:string, htmlData:any) => {
      
    if(!htmlData) throw new Error('HTML data not found!')

    const printTab = window.open(tabName, '_blank');
      // const printTab = window.open('', '_blank'); // Open in a new tab
      
      // const content = document.getElementById('printableContent')?.innerHTML || '';
      const content = htmlData
  
      // console.log('generated content', content)
      if (!printTab) return; // Popup blocked
    
      // Create a unique ID to match messages
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
            ${content}
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
    };