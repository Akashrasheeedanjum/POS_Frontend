import { useEffect, useRef, useState } from "react";
import { mergeVatGroups } from "../Helper/vatGroupSorting";
import { formatDate } from "../../sales/_components/ReceiptGenerators/HTMLTableGenerators";
import { HashLoader } from "react-spinners";

interface props{
isLoading?: boolean;
data?: any
styles?: any
onReady?: (getHtml: () => string) => void;
}

export function getTimeFromUTC(dateString:any) {
  const date = new Date(dateString);
  // Get hours, minutes, seconds in UTC
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function ReceiptTemplate({data, isLoading, styles, onReady}: props) {




    const tableRef:any = useRef(null);
    const reportRef:any = useRef(null);


  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    if (tableRef.current) {
      const tableWidth = tableRef.current.offsetWidth;
      // Approximate character width (adjust if needed for your font size)
      const charWidth = 7;
      setStarCount(Math.floor((tableWidth - 19) / charWidth));
    }
  }, []);

    useEffect(() => {
      if(onReady){
        onReady(() => reportRef.current?.outerHTML || "");
      }
  }, [onReady]);

  const {receiptsTotalSales, receiptsVatGroups, receiptsPayments, InvoicesAndCreditNotes, InvoicesVatGroups,
    invoicesPayments, salesByCategory, deliveryNotesSales, deliveryNotesPayments, salesOrderSales, salesOrderPayments,
    TurnoverTotal, TotalCash, periodFrom, periodTo
  } = data
 
  const receiptVatGroups = mergeVatGroups(receiptsVatGroups[0]?.vatGroups)
  const invoiceVatGroups = mergeVatGroups(InvoicesVatGroups[0]?.vatGroups)
  
  let now:any = new Date()
  now = now.toISOString()

  return (
<>
        {isLoading ? (
        <div className='w-full h-full flex flex-col justify-center items-center'>
        <HashLoader color="#E4D8D2" size={60}/>
        </div>
  ) : (
    <div
    ref={reportRef}
      className={[
        "bg-background text-foreground",
        "rounded-sm border border-border",
        "mx-auto",
        "lg:p-[18px]",
        "shadow-sm",
        "overflow-x-auto lg:overflow-x-hidden",
        "h-full",
        "w-[550px]",
        "font-mono text-[13px] leading-5 whitespace-pre",
        "scrollbar-custom",
        styles ?? ""
      ].join(" ")}
    //   style={{ width: `${WIDTH}ch` }}
      // style={{ width: '550px' }}
      aria-label="Receipt template"
    >

      <div>Period :</div>
      <div>{formatDate(periodFrom)}&nbsp;{getTimeFromUTC(periodFrom)} &gt; {formatDate(periodTo)}&nbsp;{getTimeFromUTC(periodTo)}</div>

<table  ref={tableRef} className="w-full border-collapse text-left mt-3">

  <thead>
        <tr>
          <th colSpan={4} className="font-normal leading-[9px] text-left">
            <span className="block font-mono">
              {"*".repeat(starCount) + "*"}
            </span>
          </th>
        </tr>

    <tr>
      <th colSpan={4} className="leading-3 font-normal">
        &lt; TICKETS &gt;
      </th>
    </tr>
        <tr>
          <th colSpan={4} className="font-normal text-left">
            <span className="block font-mono">
              {"*".repeat(starCount) + "*"}
            </span>
          </th>
        </tr>
  </thead>


  <tbody className="w-full">
    <tr>
      <td colSpan={2} className="leading-3">&lt; TICKETS SALES &gt;</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.ticketsSales?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.receiptsCount ?? 0} #</td>
    </tr>

    <tr>
      <td colSpan={2} className="leading-3">&lt; REFUNDS &gt;</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.refunds?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.refundsCount ?? 0} #</td>
    </tr>

    <tr>
      <td colSpan={4} className="leading-3">
            <span className="block font-mono">
              {"-".repeat(starCount) + "-"}
            </span>      
        </td>
    </tr>

    <tr>
      <td colSpan={2} className="leading-3">&lt; TURNOVER TICKETS &gt;</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.turnover?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.totalCount ?? 0} #</td>
    </tr>
    
    {receiptsTotalSales[0]?.avgTurnoverPerTicket && (
    <tr>
      <td colSpan={2} className="leading-3">&nbsp;&nbsp;Average ticket</td>
      <td className="text-end leading-3">{receiptsTotalSales[0]?.avgTurnoverPerTicket?.toFixed(2) ?? 0.00}</td>
      <td></td>
    </tr>
    )}
        
    <tr>
      <td colSpan={4} className="h-3"></td>
    </tr>

    <tr>
      <td></td>
      <td className="text-end leading-3">BASE</td>
      <td className="text-end leading-3">VAT</td>
      <td className="text-end leading-3">TOTAL</td>
    </tr>
    
    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      {receiptVatGroups.length > 0 ? 
      receiptVatGroups.map((group) =>(
      <tr key={group?.label}>
      <td className="text-start leading-3">{`(${group?.label}) ${group?.vatRate}`}</td>
      <td className="text-end leading-3">{group?.totalBase?.toFixed(2)}</td>
      <td className="text-end leading-3">{group?.totalVatAmount?.toFixed(2)}</td>
      <td className="text-end leading-3">{group?.totalAmount?.toFixed(2)}</td>
    </tr> 
    ))
: null  
    }
   
    <tr>
      <td></td>
      <td colSpan={3} className="text-end leading-[8px]">
        ------------------------------------
      </td>
    </tr>

      <tr>
      <td></td>
      <td className="text-end leading-3">{receiptsVatGroups[0]?.grandTotalBases?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{receiptsVatGroups[0]?.grandTotalVatAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{receiptsVatGroups[0]?.grandTotalAmount?.toFixed(2) ?? 0.00}</td>
    </tr>

      <tr>
      <td>TICKETS Payments</td>
      </tr>

      {receiptsPayments?.length > 0 ? 
      receiptsPayments?.map((payment:any) => (
      <tr key={payment?.methodName}>
      <td className="leading-3">{payment?.methodName}</td>
      <td></td>
      <td className="text-end leading-3">{payment?.totalAmount.toFixed(2)}</td>
      <td></td>
    </tr>
      )): null}

    <tr>
      <td colSpan={4} className="h-4"></td>
    </tr>

        <tr>
          <td colSpan={4} className="font-normal text-left leading-[9px]">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>
    <tr>
      <td colSpan={4} className="leading-3">
        &lt; INVOICES SALES &gt;
      </td>
    </tr>
        <tr>
          <td colSpan={4} className="font-normal text-left">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>

      <tr>
      <td colSpan={2} className="leading-3">&lt; INVOICES &gt;</td>
      <td className="text-end leading-3">{InvoicesAndCreditNotes[0]?.totalInvoiceAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{InvoicesAndCreditNotes[0]?.invoicesCount ?? 0} #</td>
    </tr>

    <tr>
      <td colSpan={2} className="leading-3">&lt; CREDIT NOTES &gt;</td>
      <td className="text-end leading-3">{InvoicesAndCreditNotes[0]?.totalCreditNoteAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{InvoicesAndCreditNotes[0]?.creditNotesCount ?? 0} #</td>
    </tr>

    <tr>
      <td colSpan={4} className="leading-3">
            <span className="block font-mono">
              {"-".repeat(starCount) + "-"}
            </span>      
        </td>
    </tr>

    <tr>
      <td colSpan={2} className="leading-3">&lt; TURNOVER INVOICES &gt;</td>
      <td className="text-end leading-3">{InvoicesAndCreditNotes[0]?.turnoverAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{InvoicesAndCreditNotes[0]?.turnoverCount ?? 0} #</td>
    </tr>

    <tr>
      <td colSpan={4} className="h-3"></td>
    </tr>

    <tr>
      <td></td>
      <td className="text-end leading-3">BASE</td>
      <td className="text-end leading-3">TVA</td>
      <td className="text-end leading-3">TOTAL</td>
    </tr>

    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>


      {invoiceVatGroups?.length > 0 ? 
      invoiceVatGroups?.map((group) =>(
      <tr key={group?.label}>
      <td className="text-start leading-3">{`(${group?.label}) ${group?.vatRate}`}</td>
      <td className="text-end leading-3">{group?.totalBase?.toFixed(2)}</td>
      <td className="text-end leading-3">{group?.totalVatAmount?.toFixed(2)}</td>
      <td className="text-end leading-3">{group?.totalAmount?.toFixed(2)}</td>
    </tr> 
    )): null  
    }

      <tr>
      <td></td>
      <td colSpan={3} className="text-end leading-[8px]">
        ------------------------------------
      </td>
    </tr>

      <tr>
      <td></td>
      <td className="text-end leading-3">{InvoicesVatGroups[0]?.grandTotalBases?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{InvoicesVatGroups[0]?.grandTotalVatAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{InvoicesVatGroups[0]?.grandTotalAmount?.toFixed(2) ?? 0.00}</td>
    </tr>


    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

    <tr>
      <td>INVOICES PAYMENTS</td>
    </tr>

    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      {invoicesPayments?.length > 0 ? 
      invoicesPayments?.map((payment:any) => (
      <tr key={payment?.methodName}>
      <td className="leading-3">{payment?.methodName}</td>
      <td></td>
      <td className="text-end leading-3">{payment?.totalAmount.toFixed(2)}</td>
      <td></td>
    </tr>
      )): null
      }

    <tr>
      <td colSpan={4} className="h-1"></td>
    </tr>

      <tr>
      <td>Invoices balance</td>
      <td></td>
      <td className="text-end">{InvoicesAndCreditNotes[0]?.totalDueInvoiceBalance?.toFixed(2) ?? 0.00}</td>
      <td></td>
    </tr>


    <tr>
      <td colSpan={4} className="h-4"></td>
    </tr>

        <tr>
          <td colSpan={4} className="font-normal text-left leading-[9px]">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>
    <tr>
      <td colSpan={4} className="leading-3">
        &lt; SALES BY CATEGORIES &gt;
      </td>
    </tr>
        <tr>
          <td colSpan={4} className="font-normal text-left">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>

    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      {salesByCategory?.length > 0 ? 
      salesByCategory?.map((sale:any) => (
      <tr key={sale?.articleCategory}>
      <td className="leading-3">{sale?.articleCategory}</td>
      <td></td>
      <td className="text-end leading-3">{sale?.saleAmount?.toFixed(2)}</td>
      <td className="text-end leading-3">{sale?.totalQuantity} #</td>
    </tr>
      )): null  
    }

    <tr>
      <td colSpan={4} className="h-4"></td>
    </tr>

        <tr>
          <td colSpan={4} className="font-normal text-left leading-[9px]">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>
    <tr>
      <td colSpan={4} className="leading-3">
        &lt; PROFORMATS &gt;
      </td>
    </tr>
        <tr>
          <td colSpan={4} className="font-normal text-left">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>

    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      <tr>
      <td colSpan={2}>&lt; DELIVERY NOTES &gt;</td>
      <td className="text-end">{deliveryNotesSales[0]?.totalDeliveryNoteAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end">{deliveryNotesSales[0]?.deliveryNoteCount ?? 0} #</td>
    </tr>

      <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      <tr>
      <td>PAYMENTS & ADVANCES</td>
    </tr>

      <tr>
      <td colSpan={4} className="h-[6px]"></td>
    </tr>


      {deliveryNotesPayments?.length > 0 ? 
      deliveryNotesPayments?.map((payment:any) => (
      <tr key={payment?.methodName}>
      <td className="leading-3">{payment?.methodName}</td>
      <td></td>
      <td className="text-end leading-3">{payment?.totalAmount.toFixed(2)}</td>
      <td></td>
    </tr>
      )): null
      }


    <tr>
      <td colSpan={4} className="leading-3">
            <span className="block font-mono">
              {"-".repeat(starCount) + "-"}
            </span>      
        </td>
    </tr>


    <tr>
      <td colSpan={2} className="leading-3">&lt; SALES ORDERS &gt;</td>
      <td className="text-end leading-3">{salesOrderSales[0]?.totalSalesOrderAmount?.toFixed(2) ?? 0.00}</td>
      <td className="text-end leading-3">{salesOrderSales[0]?.salesOrderCount ?? 0} #</td>
    </tr>

      <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      <tr>
      <td>PAYMENTS & ADVANCES</td>
    </tr>

      <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      {salesOrderPayments?.length > 0 ? 
      salesOrderPayments?.map((payment:any) => (
      <tr key={payment?.methodName}>
      <td className="leading-3">{payment?.methodName}</td>
      <td></td>
      <td className="text-end leading-3">{payment?.totalAmount.toFixed(2)}</td>
      <td></td>
    </tr>
      )): null
      }



    <tr>
      <td colSpan={4} className="leading-3">
            <span className="block font-mono">
              {"-".repeat(starCount) + "-"}
            </span>      
        </td>
    </tr>

        <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>
    
    {now > data?.prvRep_CashFundDate &&
    (<>
        <tr>
          <td colSpan={4} className="font-normal text-left leading-[9px]">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>
    <tr>
      <td colSpan={4} className="leading-3">
        &lt; DEPOSITS / WITHDRAWALS &gt;
      </td>
    </tr>
        <tr>
          <td colSpan={4} className="font-normal text-left">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>
    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

      <tr>
      <td colSpan={4} className="leading-[10px]">-&gt;CASH DEPOSIT</td>
    </tr>
      <tr>
      <td colSpan={4} className="leading-[10px]">&nbsp;&nbsp;CASH FUND FROM {formatDate(data?.prvRep_CashFundDate)}</td>
    </tr>
      <tr>
      <td colSpan={4} className="leading-[10px]">&nbsp;&nbsp;Amount: {data?.prvRep_CashFund} CASH</td>
    </tr>

      <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>
</>)
    }
        <tr>
          <td colSpan={4} className="font-normal text-left">
              {"*".repeat(starCount) + "*"}
          </td>
        </tr>

    <tr>
      <td className="leading-3">TURNOVER TOTAL</td>
      <td></td>
      <td></td>
      <td className="text-end leading-3">{TurnoverTotal?.toFixed(2) ?? 0.00} €</td>
    </tr>
    <tr>
      <td className="leading-3">TOTAL CASH</td>
      <td></td>
      <td></td>
      <td className="text-end leading-3">{TotalCash?.toFixed(2) ?? 0.00} €</td>
    </tr>
    <tr>
      <td className="leading-3">TOTAL Counted</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>

    {data?.cashFundReportedTo && 
    (<>
    
    <tr>
    <td colSpan={4} className="font-normal text-left">
        {"*".repeat(starCount) + "*"}
    </td>
    </tr>

    <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>

    <tr>
      <td colSpan={4} className="leading-[10px]">CASH WITHDRAWALS AT THE CLOSING: {data?.cashWithDrawal_atClosing}</td>
    </tr>
      <tr>
      <td colSpan={4} className="leading-[10px]">CASH FUND REPORTED TO: {formatDate(data?.cashFundReportedTo)}</td>
    </tr>
      <tr>
      <td colSpan={4} className="leading-[10px]">Montant: {data?.Montant}</td>
    </tr>

      <tr>
      <td colSpan={4} className="h-2"></td>
    </tr>
</>)}
  </tbody>
</table>



     
     
    </div>
    )
    }
    </>
  )
}
