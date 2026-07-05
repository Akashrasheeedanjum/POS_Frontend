'use client';
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import LastClosingModal from './LastClosingModal'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { filterLastClosing } from '@/app/Redux/Slices/lastClosingSlice';
import { formatDate } from '../../sales/_components/ReceiptGenerators/HTMLTableGenerators';
import { getTimeFromUTC } from './ReceiptTemplate';
import { setToken } from '@/app/Redux/Slices/customerSlice';
import { useSession } from '@clerk/nextjs';
import { toast } from 'sonner';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token

    const [modalOpen, setModalOpen] = useState<any>(false)
    const handleModalClose = () => {
      setModalOpen(false)
    }

    const reportData = useSelector((state: RootState) => state.lastClosing.data);
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

  return (
    <div className='flex justify-center'>

            <div
              className="
                 w-[90%] LMB:w-[70%] ELMB:w-[50%] md:w-[60%] lg:w-[20%] lg:min-w-[220px] 
                bg-[#EDEEEF] min-h-full bg-opacity-90 px-2 py-2  lg:p-5
                flex-shrink-0 rounded-md mt-4 shadow-2xl
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

                <p className="mt-4 text-center font-bold">Closing</p>
                <p className="text-center text-[12px] mt-2">Cash Total</p>
                <p className="text-center text-[20px] font-bold text-blue-500">
                  {reportData[0]?.TotalCash?.toFixed(2) ?? 0.00}
                </p>   

                <Button variant={'link'}
                onClick={() => setModalOpen(true)}
                className='mt-4 flex justify-center w-full text-red-500 text-[14px] md:text-[1rem] border-b-[1px]'
                >
                <span className='underline'>View full report</span>
                </Button>
              </div>
              </div>
            </div>
    <LastClosingModal 
       open={modalOpen}
       onClose={handleModalClose}
      />
    </div>
  )
}

export default MainContent
