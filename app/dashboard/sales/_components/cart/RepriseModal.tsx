'use client';

import { filterCustomers, setToken} from '@/app/Redux/Slices/customerSlice';
import { cartEmpty, fetchWaitingTickets, updateWaitingTicketsCount, updateWaitingTicketsList } from '@/app/Redux/Slices/salesSlice';
import { AppDispatch, RootState } from '@/app/Redux/store';
import DeleteConfirmationModal from '@/components/modal/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteWaitingTicket } from '@/lib/actions/sales.actions';
import { useSession } from '@clerk/nextjs';
import { Check, X, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import { toast } from 'sonner';


interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  ticketData: (userData:any) => void
}

const RepriseModal = ({
  open,
  onClose,
  ticketData
}: CustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const waitingTickets:any = useSelector((state: RootState) => state.sales.waitingTickets);
  const waitingTicketsCount = useSelector((state: RootState) => state.sales.waitingTicketsCount);
  const isWaitTicketsLoading = useSelector((state: RootState) => state.sales.isWaitTicketsLoading);

    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [ticketToDelete, setTicketToDelete] = useState<any>()
    const [openTicketDeleteModal, setOpenTicketDeleteModal] = useState(false)
    const [isTicketDeleting, setIsTicketDeleting] = useState(false)

    const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token

const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(setToken(token));
    if(token){
      dispatch(fetchWaitingTickets({token:token}))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
    }
  }, [token, dispatch]);


    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
    if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
      setSelectedRow(null); // clear selection
      setSelectedTicket(null)
    }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    }, []);





  const handleOkay = () => {
    if(!selectedTicket){
        toast.error('Ticket is not Selected!')
        return
    }
    dispatch(cartEmpty('empty'))
    ticketData(selectedTicket)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  function changeDateFormat(isoDate:any){
    const formattedDate = new Date(isoDate).toLocaleDateString("en-GB") 
    return formattedDate
  }

  function extractTimeFromDate(isoDate:any){
  const date = new Date(isoDate);
  const time = date.toTimeString().split(" ")[0];
  return time
  }

  const handleDeleteTicketRequest = (ticketData:any) => {
        setTicketToDelete(ticketData)
        setOpenTicketDeleteModal(true)
  }


        const handleDeleteWaitingTicket = async() => {
          const id = ticketToDelete?._id
          setIsTicketDeleting(true)
          try {
              await deleteWaitingTicket(id, token)   
              dispatch(updateWaitingTicketsList(waitingTickets.filter((ticket:any) => ticket._id !== id)))
              dispatch(updateWaitingTicketsCount(waitingTicketsCount - 1))
              toast.success("Ticket deleted successfully")
          } catch (error) {
              console.error('Error while deleting Ticket', error)
              toast.error("Could not delete waiting Ticket!")
          }finally{
              setOpenTicketDeleteModal(false)
              setTicketToDelete(null)
              setIsTicketDeleting(false)
          }
        }

  return (
    <>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="scrollbar-custom max-h-[90vh] max-w-[45vw] overflow-auto p-0 "
        >
          <Card className="w-full border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between rounded-tl-md bg-[#DAAC95] p-3 text-white">
              <CardTitle className="w-[90%] flex justify-between items-center">
               <p className='text-xl font-medium text-black'>Resuming a waiting Ticket</p> 
               <p className='text-black'>Count: <span className='text-red-600'>{waitingTicketsCount}</span></p> 
              </CardTitle>
            </CardHeader>

            <CardContent >

{isWaitTicketsLoading ? (
          <div className='w-full h-[30vh] flex flex-col justify-center items-center'>
          <HashLoader color="#E4D8D2" size={60}/>
          </div>
    ) : (<>

            <DeleteConfirmationModal 
            open={openTicketDeleteModal}
            onClose={() => setOpenTicketDeleteModal(false)}
            onConfirm={handleDeleteWaitingTicket}
            message={`Delete waiting Ticket of: ${ticketToDelete?.customer?.firstName}, from date: ${changeDateFormat(ticketToDelete?.createdAt)}, ${extractTimeFromDate(ticketToDelete?.createdAt)}?`}
            loadingState={isTicketDeleting}
            />

    {waitingTickets.length > 0 ? (
    <div ref={tableRef} className="w-full py-4 ">
  <div className='max-h-[200px]  overflow-y-auto scrollbar-custom'>
      <Table className=" border rounded-lg ">
        <TableHeader className='sticky top-0 z-20'>
          <TableRow className="bg-white hover:bg-white">
            <TableHead className="font-semibold">Customer Name</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Time</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waitingTickets.map((ticket:any) => (
            
            <TableRow
              key={ticket._id}
              onClick={() => {
                setSelectedRow(ticket._id)
                setSelectedTicket(ticket)
              }}
              className={` ${
                selectedRow === ticket._id
                  ? "bg-muted/50"
                  : `transition-colors hover:bg-muted/50`
              }`}
            >
              <TableCell>{ticket.customer?.firstName}</TableCell>
              <TableCell>{changeDateFormat(ticket?.createdAt)}</TableCell>
              <TableCell>{extractTimeFromDate(ticket?.createdAt)}</TableCell>
              <TableCell>
              <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTicketRequest(ticket)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                  <Trash2 size={18} />
              </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
    ): (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 min-h-[300px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No Waiting Ticket found!</h3>
        </div>
      </div>
      )}
    </>)}


                <div className='flex justify-end gap-2'>
                <Button type='button' className='bg-blue-400 hover:bg-blue-600'
                onClick={handleOkay}
                >
                  <Check className="mr-2 h-4 w-4" /> <span className="text-[14px]">Ok</span>
                </Button>
                <Button className='bg-red-400 hover:bg-red-600' type='button' 
                onClick={handleCancel}
                >
                  <X className="mr-2 h-4 w-4" /> <span className="text-[14px]">Cancel</span>
                </Button>
                
                </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RepriseModal;
