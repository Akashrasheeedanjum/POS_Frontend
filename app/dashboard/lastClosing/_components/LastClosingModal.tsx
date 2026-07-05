"use client"
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Printer, Receipt, Save, X } from "lucide-react";
import ReceiptTemplate, { getTimeFromUTC } from "./ReceiptTemplate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectViewport } from "@radix-ui/react-select";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { filterLastClosing, setQuery } from "@/app/Redux/Slices/lastClosingSlice";
import { formatDate } from "../../sales/_components/ReceiptGenerators/HTMLTableGenerators";
import { cloneDeep } from "lodash";
import { convertToISODate, formatToDDMMYYYY, getTodayInBrussels } from "@/app/folder/financialAndJournals/paymentMethod/_components/SearchFilters";
import { convertBrusselsToUTC } from "../Helper/brusselTimeToUTC";
import { createZReport } from "@/lib/actions/lastClosing.actions";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import ConfirmationModal from "@/components/ConfirmationModal";
import { openPrintForReport } from "../Helper/printReport";
import { setToken } from "@/app/Redux/Slices/customerSlice";
import { useSession } from "@clerk/nextjs";

interface LastClosingModalProps {
  open: boolean;
  onClose: () => void;
}

const today1 = getTodayInBrussels()

function getNextDayInBrussels() {
  const nowInBrussels = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Brussels" })
  );

  nowInBrussels.setDate(nowInBrussels.getDate() + 1);

  const year = nowInBrussels.getFullYear();
  const month = String(nowInBrussels.getMonth() + 1).padStart(2, "0");
  const day = String(nowInBrussels.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}



const LastClosingModal = ({ open, onClose }: LastClosingModalProps) => {
  const title = "X / Z Report";


  const dispatch = useDispatch<AppDispatch>();

    const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token

  const [isDropOpen, setDropOpen] = useState<any>(false);
  const [register, setRegister] = useState<any>();
  const [reportType, setReportType] = useState("xReport");
  const [totalInCheckout, setTotalInCheckout] = useState<any>("");
  const [cashWithdrawal, setCashWithdrawal] = useState<any>();
  const [newCashFund, setNewCashFund] = useState<any>(0.00);
  const [futureDateForFund, setFutureDateForFund] = useState<any>(getNextDayInBrussels());
  const [byDateCalender, setByDateCalender] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState<any>(false);
  const [openZReportModal, setOpenZReportModal] = useState<any>(false);
  const [openReprintModal, setOpenReprintModal] = useState<any>(false);

  const reportData = useSelector((state: RootState) => state.lastClosing.data);
  const isLastClosingLoading = useSelector((state: RootState) => state.lastClosing.isLastClosingLoading);
  const query = useSelector((state: RootState) => state.lastClosing.query);
  
  const options = ["All checkout counter", ...Array.from({ length: 15 }, (_, i) => i + 1)];

  const totalCash = reportData[0]?.TotalCash

    useEffect(() => {
      dispatch(setToken(token));
      if(token){
        dispatch(filterLastClosing({token:token}))
        .unwrap()
        .catch((err) => {
          toast.error(err);
        });
      }
  }, [token, dispatch]);

      const handleRadioChange = (value: any) => {

        let queryObject:any = {}
        if(Object.keys(queryObject).length == 0) queryObject = {}    

        if(value == 'byDate') {
        setReportType(value)
        setByDateCalender(convertToISODate(today1))
        queryObject['byDate'] = byDateCalender ?? today1
      }
      else if(value == 'xReport') {
        setReportType(value)
        setByDateCalender(null)
        queryObject['xReport'] = true
      }
      else{
        setReportType('byDate')
        setByDateCalender(value)
        queryObject['byDate'] = formatToDDMMYYYY(value)
      }
      
    
      // console.log('queryObject', queryObject)
      // return

      dispatch(setQuery(queryObject))
      dispatch(filterLastClosing({query:queryObject}))
    
      };

      const handleCashWithDrawal = (value:any)=>{
        setCashWithdrawal(value)
        setNewCashFund(totalCash - value)
      }

      const handleTotEnCassie = () => {
        setCashWithdrawal(totalCash)
        setNewCashFund(0.00)
      }

  const getChildHtmlRef = useRef<(() => string) | null>(null);

  const handleChildHTML = (getter: () => string) => {
    getChildHtmlRef.current = getter;
  };

    const handleXReport = async() => {
    const html = getChildHtmlRef.current?.() || "";

    await openPrintForReport('XReport', html)
  };

        const handleCreateZReport = async() =>{

        const payload = {
          periodFrom: convertBrusselsToUTC(reportData[0]?.periodFrom) ,
          periodTo: convertBrusselsToUTC(reportData[0]?.periodTo) ,
          cashWithDrawal_atClosing: Number(cashWithdrawal),
          totalInCheckoutCounter: Number(totalInCheckout),
          newCashFund: Number(newCashFund),
          cashFundFor: new Date(futureDateForFund + "T00:00:00.000Z").toISOString()
        }

        if(  !payload.cashWithDrawal_atClosing ||
             isNaN(payload.cashWithDrawal_atClosing) ||
             payload.cashWithDrawal_atClosing <= 0){
          toast.error('Indicate the amount taken!')
          return
        }

        const html = getChildHtmlRef.current?.() || "";

          try {
            setSaveLoading(true)
            const resp = await createZReport(payload, token);
            console.log('report created successfully', resp)
        
            setCashWithdrawal('')
            setTotalInCheckout('')
            setNewCashFund('')
            setFutureDateForFund(getNextDayInBrussels())
            dispatch(setQuery({}))
                
            await openPrintForReport('ZReport', html)
            toast.success(`Z Report created successfully!`)
            onClose()
          } catch (error) {
            console.error(`Error creating Z Report`, error)
            toast.error(`${error}`)
          }finally{
            setSaveLoading(false)
            setOpenZReportModal(false)
          }
      }

  return (

 <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="max-w-[95vw] min-h-[95vh] h-[95vh] p-0 overflow-y-auto lg:overflow-y-hidden"
      >
        <Card className="w-full h-full border-none shadow-none bg-transparent flex flex-col overflow-auto lg:overflow-hidden">
          {/* Header */}
          <CardHeader className="flex flex-row justify-between items-center bg-[#DAAC95] text-white p-3 rounded-tl-md">
            <CardTitle className="text-black text-xl font-medium">
              {title}
            </CardTitle>
          </CardHeader>

          {/* Responsive Layout Body */}
          <CardContent
            className="
              flex flex-col lg:flex-row
              overflow-auto LS:overflow-hidden p-0
            "
          >
            {/* Left Column */}
            <div
              className="
                 lg:w-[20%] lg:min-w-[220px] 
                bg-[#EDEEEF] min-h-full bg-opacity-90 px-2 py-2  lg:p-5
                flex-shrink-0
              "
            >
              <div className="flex justify-center">
              <div className="w-[80%] ELMB:w-[60%] md:w-[40%] lg:w-full">
                <p className="text-center font-bold">Last Cash Closing</p>

                <div className="flex justify-between text-[14px] font-mono">
                  <span className="w-[60%]">Date</span>
                  <span className="text-start w-[40%]">{reportData[0]?.prvRep_createdAt ? formatDate(reportData[0]?.prvRep_createdAt) : formatDate(reportData[0]?.periodFrom)}</span>
                </div>

                <div className="flex justify-between text-[14px] font-mono">
                  <span className="w-[60%]">Time</span>
                  <span className="text-start w-[40%]">{reportData[0]?.prvRep_createdAt ? getTimeFromUTC(reportData[0]?.prvRep_createdAt) : getTimeFromUTC(reportData[0]?.periodFrom)}</span>
                </div>

                <div className="flex justify-between text-[14px] font-mono">
                  <span className="w-[60%]">Employee</span>
                  <span className="text-start w-[40%]">{reportData[0]?.prvRep_Employee ? reportData[0]?.prvRep_Employee : ''}</span>
                </div>

                <div className="flex justify-between text-[14px] font-mono">
                  <span className="w-[60%]">N°</span>
                  <span className="text-start w-[40%]">{reportData[0]?.prvRep_Number ? reportData[0]?.prvRep_Number : 1}</span>
                </div>

                {/* <div className="relative mt-2 w-full flex justify-center">
                  <Button
                  onClick={() => setOpenReprintModal(true)}
                    variant="outline"
                    className="w-[75%] border-gray-500 hover:bg-white hover:text-black"
                  >
                    Reprint Z Report
                  </Button>

                {openReprintModal && 
                <div className="absolute left-20 -top-12 border-black border-[1px] rounded-md w-[250px] h-[150px] bg-white ">
                  Reprint modal
                  </div>
                }
                  
                </div> */}

                <p className="text-center font-bold mt-6">Reports</p>
                              {/* Register Dropdown */}
                {/* <p className="text-start text-gray-600">Register</p>
              <div className="relative flex justify-center">
                <button
                  onClick={() => setDropOpen((prev:any) => !prev)}
                  className="
                     flex items-center justify-between h-9 w-[75%] lg:w-full
                    rounded-md border border-gray-500 bg-transparent px-3 py-2
                    text-sm text-left shadow-sm outline-none
                  "
                >
                  <span className={cn("truncate")}>
                    {register ?? "All checkout counter"}
                  </span>
                  <CaretSortIcon className="h-4 w-4 opacity-50" />
                </button>

                {isDropOpen && (
                  <div
                    className="
                      absolute z-50 mt-2 w-full rounded-md border border-border
                      bg-popover shadow-md max-h-28 overflow-y-auto scrollbar-custom
                    "
                  >
                    {options?.map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setRegister(item);
                          setDropOpen(false);
                        }}
                        className={cn(
                          "cursor-pointer px-3 py-2 text-sm hover:bg-[#EDEEEF]"
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

                            {/* Radio Buttons */}
              <div className="mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reportType"
                    value="xReport"
                    checked={reportType === "xReport"}
                    // onChange={(e) => setReportType(e.target.value)}
                    onChange={(e) => handleRadioChange(e.target.value)}
                    className="cursor-pointer"
                  />
                  <span className="text-[14px]">X Report</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reportType"
                    value="byDate"
                    checked={reportType === "byDate"}
                    onChange={(e) => handleRadioChange(e.target.value)}
                    className="cursor-pointer"
                  />
                  <span className="text-[14px]">By Date</span>
                </label>

                {byDateCalender && 
                <Input
                  type="date"
                  value={byDateCalender}
                  // onChange={(e) => setByDateCalender(e.target.value)}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="mt-2 w-[75%] lg:w-full md:max-w-sm placeholder:text-gray-300 date-icon-right border-gray-500"
                />
                }
              </div>

              {/* Buttons */}
              <div className="mt-2 w-full flex flex-col items-center gap-2">
                {/* <Button className="flex gap-2 w-[80%] border-gray-500 bg-green-600 text-white hover:bg-green-500">
                  <Receipt className="h-4 w-4" />{" "}
                  <span className="text-[14px]">Cash Counter</span>
                </Button> */}

                {byDateCalender &&
                <Button 
                onClick={handleXReport}
                className="flex gap-2 w-[80%] border-gray-500 bg-blue-600 text-white hover:bg-blue-500">
                  <Printer className="h-4 w-4" />{" "}
                  <span className="text-[14px]">Print X Report</span>
                </Button>
                }
              </div>
              
              </div>
              </div>




            </div>

            {/* Middle Column */}
            <div
              className="
                min-h-[60vh] w-full lg:w-[60%] flex flex-col
                overflow-y-auto scrollbar-custom
                px-2 py-3
              "
            >
              <div className="flex justify-center h-full">
              {reportData[0] && Object.keys(reportData[0]).length > 0 ?   
                   <ReceiptTemplate data={reportData[0]} isLoading= {isLastClosingLoading} 
                   onReady={handleChildHTML}
                   />
               : null}
              </div>
            </div>

            {/* Right Column */}
            <div
              className="
                w-full lg:w-[20%] lg:min-w-[220px]
                bg-[#EDEEEF] bg-opacity-90 px-2 py-2 lg:p-5 
                flex-shrink-0
              "
            >
              <div className="flex justify-center">
              <div className="w-[80%] ELMB:w-[60%] md:w-[40%] lg:w-full">
              <div className="flex flex-col items-center">
                <p className="text-center font-bold">Closing</p>
                <p className="text-center text-[12px] mt-2">Cash Total</p>
                <p className="text-center text-[20px] font-bold text-blue-500">
                  {reportData[0]?.TotalCash?.toFixed(2) ?? 0.00}
                </p>

                <p className="text-center mt-2">Total In Checkout Counter</p>
                <Input
                  className="w-[75%] mb-2 border-gray-500 outline-none focus-visible:ring-0"
                  type="number"
                  value={totalInCheckout}
                  onWheel={(e:any) => e.target.blur()}
                  onChange={(e) => setTotalInCheckout(e.target.value)}
                />

                <p className="text-center mt-2">Cash withdrawal</p>
                <Input
                  className="w-[75%] mb-2 border-gray-500 outline-none focus-visible:ring-0"
                  type="number"
                  value={cashWithdrawal}
                  onWheel={(e:any) => e.target.blur()}
                  onChange={(e) => handleCashWithDrawal(e.target.value)}
                />

                <div className="flex justify-center">
                  <Button
                  onClick={handleTotEnCassie}
                    variant="outline"
                    className="
                      text-[14px] flex gap-2 py-1 w-[100%] border-gray-500
                      text-red-500 hover:bg-inherit hover:text-black hover:border-blue-500
                    "
                  >
                    Tot.en caisse
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="text-center text-[12px] mt-2">
                    New cash fund
                  </p>
                  <p className="text-center text-[20px] font-bold text-blue-500">
                    {newCashFund ? newCashFund?.toFixed(2) : 0.00}
                  </p>
                </div>

                <p className="text-[12px] mt-2 text-red-500">
                  Post the cash fund for
                </p>
                <Input
                  type="date"
                  value={futureDateForFund}
                  onChange={(e) => setFutureDateForFund(e.target.value)}
                  className="w-[75%] lg:w-full md:max-w-sm placeholder:text-gray-300 date-icon-right border-gray-500"
                />

                <div className="flex gap-2 mt-3 justify-center">
                  {reportType == 'xReport' &&
                  <Button 
                  disabled={saveLoading}
                  onClick={() => setOpenZReportModal(true)} className="flex gap-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-500">
                  {!saveLoading ? 
                  <>
                  <Check className="h-4 w-4" />{" "}
                  <span className="text-[14px]">Z Report</span>
                  </> : 
                  <ClipLoader color="ClipLoader" size={20}/>
                  } 
                    
                  </Button>
                  }
                  <Button onClick={onClose} className="border-red-700 bg-red-700 text-white hover:bg-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              </div>
              </div>
            </div>

          <ConfirmationModal
            open={openZReportModal}
            onClose={() => setOpenZReportModal(false)}
            onConfirm={handleCreateZReport}
            message={`Close checkout counter?... Confirm`}
          />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LastClosingModal;
