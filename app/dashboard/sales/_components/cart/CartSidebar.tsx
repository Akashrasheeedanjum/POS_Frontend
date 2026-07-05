// "use client"
import { useEffect, useRef, useState } from 'react';
import type { CartItem as CartItemType } from '@/types/sales';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CartItem from './CartItem';
// import { toast } from 'react-toastify'
import {
  ShoppingCart,
  Users,
  RotateCcwIcon,
  Trash2,
  Search,
  UserPlus,
  RotateCcw,
  Receipt,
  Menu,
  Hourglass
} from 'lucide-react';
import { SelectionModal } from './selection-modal';
import { articlesData } from '../../data/articles-data';
import { customersData } from '../../data/customers-data';
import { documentsData } from '../../data/documents-data';
import { ReceiptsModal } from './receipts-modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import CustomerModal from '@/app/folder/documentAndSales/documents/_components/CustomerModal';
import {
  cartEmpty,
  fetchWaitingTickets,
  setOpenCustomerModal,
  setSelectedCustomerForTicket,
  setWaitingTicketData
} from '@/app/Redux/Slices/salesSlice';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import RepriseModal from './RepriseModal';
import { formatCurrency } from '@/lib/currency';
import { createWaitingTicket } from '@/lib/actions/sales.actions';
import { ClipLoader, FadeLoader } from 'react-spinners';
import { useSession } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { Article, getArticleById } from '@/lib/actions/articles.actions';

interface CartSidebarProps {
  allProducts: any;
  cartItems: CartItemType[];
  totalAmount: number;
  totalItems: number;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onAddToCart: (product: Article) => void;
}

export default function CartSidebar({
  allProducts,
  cartItems,
  totalAmount,
  totalItems,
  onRemoveItem,
  onUpdateQuantity,
  onAddToCart
}: CartSidebarProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [repriseModal, setRepriseModal] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [scannerValue, setScannerValue] = useState<string>('');
  const scanInputRef = useRef<HTMLInputElement>(null);

  const [selectedTicketData, setSelectedTicketData] = useState<any>(null);
  // const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isCustomerModalOpen = useSelector(
    (state: RootState) => state.sales.isCustomerModalOpen
  );
  const selectedCustomerForTicket = useSelector(
    (state: RootState) => state.sales.selectedCustomerForTicket
  );

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token;


useEffect(() => {
  const focusScanner = () => {
    scanInputRef.current?.focus();
  };

  // 1️⃣ Handle dialog open/close
  const handleFocusManagement = () => {
    const anyDialogOpen = document.querySelector('[role="dialog"]');
    if (!anyDialogOpen) {
      focusScanner();
    }
  };

  const observer = new MutationObserver(handleFocusManagement);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 2️⃣ Handle user clicks / key presses
  const handleUserInteraction = (e: Event) => {
    const anyDialogOpen = document.querySelector('[role="dialog"]');
    const target = e.target as HTMLElement;

    // Only refocus if no dialog AND clicked outside input
    if (
      !anyDialogOpen &&
      target !== scanInputRef.current
    ) {
      focusScanner();
    }
  };

  window.addEventListener('click', handleUserInteraction);
  window.addEventListener('keydown', handleUserInteraction);

  // Initial focus on mount
  focusScanner();

  return () => {
    observer.disconnect();
    window.removeEventListener('click', handleUserInteraction);
    window.removeEventListener('keydown', handleUserInteraction);
  };
}, []);




  const handleSelection = (item: any, modalType: string) => {
    setSelectedItem(item);
    setActiveModal(null);
  };


  const handleOrderImportClick = () => {
    setActiveModal('documents');
  };
  const handleReceiptsClick = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty!');
      return;
    }

    if (!selectedCustomerForTicket) {
      toast.error('Please select a customer first!');
      return;
    }

    setActiveModal('receipts');
  };
  const handleModalClose = () => {
    dispatch(setOpenCustomerModal({ isModalOpen: false }));
  };
  const getCustomerData = (userData: any) => {
    // setSelectedCustomerData(userData)
    dispatch(setSelectedCustomerForTicket(userData));
  };

  const getReprisedTicketData = (ticketData: any) => {
    dispatch(setWaitingTicketData(ticketData));
    dispatch(setSelectedCustomerForTicket(ticketData?.customer));
  };

  const addToWaiting = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty!');
      return;
    }

    if (!selectedCustomerForTicket) {
      toast.error('Please select a customer first!');
      return;
    }
    setSaveLoading(true);
    try {
      const waitingTicket: any = {
        status: 'waiting',
        customer: selectedCustomerForTicket?._id,
        articles:
          cartItems?.map((item) => ({
            articleId: item.articleId,
            nameAtPurchase: item.nameAtPurchase,
            quantityOnHold: item.quantityAtPurchase
          })) || []
      };
      await createWaitingTicket(waitingTicket, token);
      dispatch(setSelectedCustomerForTicket(null));
      dispatch(cartEmpty('empty'));
      toast.success('Ticket added to Waiting!');
    } catch (error) {
      console.error(`Error creating wait Ticket`, error);
      toast.error(`${error}`);
    } finally {
      setSaveLoading(false);
    }
  };


  function getProductDetails(id:string){
    const found = allProducts.find((p:any) => p.productId === id)
    return found
  }
  const handleScannerSearch = async() => {
    const ID = scannerValue.trim();
    if (!ID) return;
    try {
      const resp = getProductDetails(ID)
      if(resp !=undefined && resp.productId){
        const foundArticle = resp
        onAddToCart(foundArticle)
      }else{
        toast.info('No article found!')
      }
    } catch (error:any) {
      toast.error(error)
    }finally{
      setScannerValue('')
    }
  };


  return (
    <>
      <div className="flex w-full flex-col border-t border-slate-300 bg-slate-50 lg:w-80 lg:border-l lg:border-t-0 xl:w-96 2xl:w-[30rem] h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-[15px] py-2 text-white">
          <div className="mb-1 flex items-center justify-between">
            <h2 className={`flex items-center text-lg font-bold`}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span
                className={`${
                  selectedCustomerForTicket ? 'text-red-700' : 'text-white'
                }`}
              >
                {selectedCustomerForTicket
                  ? selectedCustomerForTicket.firstName ??
                    selectedCustomerForTicket.nameDenomination
                  : 'Counter Sales'}
              </span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Qty: {totalItems}</span>
            <span>Total: {formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Cart Items - Scrollable with max height */}
        <div className="h-[16rem] max-h-64 lg:max-h-[460px] xl:max-h-[450px] 2xl:max-h-[510px]  flex-1 overflow-y-auto px-2 py-1  ">
          {cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-slate-400" />
              <p className="text-slate-500">No items in cart</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <CartItem
                  key={item.articleId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto  border-t   p-4 space-y-2   ">
          <div className="grid grid-cols-4 gap-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={saveLoading}
                    onClick={addToWaiting}
                    variant="outline"
                    size="sm"
                    className="flex h-auto flex-col items-center justify-center bg-white p-3 hover:bg-slate-50"
                  >
                    <Hourglass
                      className={`mb-1 h-5 w-5 ${
                        saveLoading ? 'rotate-clockwise' : ''
                      }`}
                    />
                    {!saveLoading && (
                      <span className="text-xs font-medium">Waiting</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border border-black bg-white">
                  <p>Attente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setRepriseModal(true)}
                    variant="outline"
                    size="sm"
                    className="flex h-auto flex-col items-center bg-white p-3 hover:bg-slate-50"
                  >
                    <RotateCcwIcon className="mb-1 h-5 w-5" />
                    <span className="text-xs font-medium">Recover</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border border-black bg-white">
                  <p>Reprise</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              size="sm"
              className="flex h-auto flex-col items-center bg-white p-3 hover:bg-slate-50"
              onClick={() =>
                dispatch(setOpenCustomerModal({ isModalOpen: true }))
              }
            >
              <Users className="mb-1 h-5 w-5" />
              <span className="text-xs font-medium">Customers</span>
            </Button>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex h-auto flex-col items-center bg-white p-3 hover:bg-red-300"
                    onClick={() => dispatch(cartEmpty('empty'))}
                  >
                    <Trash2 className="mb-1 h-5 w-5" />
                    <span className="text-xs font-medium">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border border-black bg-white">
                  <p>Empty Cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mt-1 LS:mt-2 flex w-full justify-between pr-2">
            <label className="text-[14px] LS:text-[16px]">Product ID</label>
            <input
            ref={scanInputRef}
              value={scannerValue}
              onChange={(e) => setScannerValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleScannerSearch();
                }
              }}

              type="text"
              className="w-[60%] rounded-sm border-[1px] border-gray-400 pl-1 text-[12px] outline-none LS:text-[15px]"
            />
          </div>

          {/* Total Section */}
          <Card className="mt-1 LS:mt-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-3">
              <div className="flex items-center">
                <div className="w-[30%]">
                  <span className="text-xl font-bold">TOTAL</span>
                </div>
                <div className="flex w-[70%] items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalAmount)}
                  </div>
                  <div className="text-sm opacity-90">{totalItems} items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-2 gap-1">
              <Button
                onClick={() =>
                  dispatch(setOpenCustomerModal({ isModalOpen: true }))
                }
                variant="outline"
                size="sm"
                className="flex h-auto flex-col items-center bg-slate-600 p-2 text-white hover:bg-slate-700"
              >
                <Search className="mb-1 h-4 w-4" />
                <span className="text-xs">Find</span>
              </Button>
              <Button
                // onClick={handleCustomersClick}

                onClick={() =>
                  dispatch(setOpenCustomerModal({ isModalOpen: true }))
                }
                variant="outline"
                size="sm"
                className={`flex h-auto flex-col items-center p-2 
                ${
                  selectedCustomerForTicket
                    ? 'bg-cyan-600 text-white'
                    : 'border-cyan-600 bg-white hover:bg-cyan-600'
                }`}
              >
                <UserPlus className="mb-1 h-4 w-4" />
                <span className="text-xs">Customers</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                onClick={handleOrderImportClick}
                variant="outline"
                size="sm"
                className="flex h-auto flex-col items-center bg-green-600 p-2 text-white hover:bg-green-700"
              >
                <RotateCcw className="mb-1 h-4 w-4" />
                <span className="text-xs">Order Import</span>
              </Button>
              <Button
                onClick={handleReceiptsClick}
                variant="outline"
                size="sm"
                className={`flex h-auto flex-col items-center p-2 transition-all ${
                  cartItems.length > 0
                    ? 'bg-red-600 text-white shadow-lg hover:bg-red-700'
                    : 'cursor-not-allowed bg-gray-400 text-gray-600'
                }`}
              >
                <Receipt className="mb-1 h-4 w-4" />
                <span className="text-xs">Receipts</span>
              </Button>
            </div>
          </div>
          {/* {selectedItem && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Last Selected Item</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(selectedItem, null, 2)}</pre>
          </div>
        )} */}
          {/* Articles Modal */}
          {/* <SelectionModal
          isOpen={activeModal === "articles"}
          onClose={() => setActiveModal(null)}
          title="Articles selection"
          data={articlesData}
          columns={[
            { key: "id", label: "Product ID", width: "w-20" },
            { key: "designation", label: "Designation", width: "flex-1" },
            { key: "refArt", label: "Ref art provided", width: "w-32" },
            { key: "qtyStock", label: "Qty stock", width: "w-20" },
            { key: "sellPrice", label: "Sell price", width: "w-24" },
          ]}
          searchConfig={{
            field: "refArt",
            label: "Ref art provided",
            placeholder: "Enter reference...",
          }}
          onSelect={(item) => handleSelection(item, "article")}
          showNewButton={true}
          showContentButton={true}
        /> */}

          {/* Customers Modal */}
          {/* <SelectionModal
          isOpen={activeModal === "customers"}
          onClose={() => setActiveModal(null)}
          title="Customer selection"
          data={customersData}
          columns={[
            { key: "code", label: "Customer code", width: "w-24" },
            { key: "denomination", label: "Denomination", width: "flex-1" },
            { key: "firstName", label: "First name", width: "w-32" },
            { key: "zipCode", label: "Zip code", width: "w-24" },
            { key: "city", label: "City", width: "w-32" },
            
          ]}
          searchConfig={{
            field: "code",
            label: "Customer code",
            placeholder: "Enter customer code...",
          }}
          onSelect={(item) => handleSelection(item, "customer")}
          showNewButton={true}
          showWordContentButton={true}
        /> */}
          {isCustomerModalOpen && (
            <CustomerModal
              open={isCustomerModalOpen}
              mode="add"
              onClose={handleModalClose}
              customerData={getCustomerData}
            />
          )}

          {/* Documents Modal */}
          <SelectionModal
            isOpen={activeModal === 'documents'}
            onClose={() => setActiveModal(null)}
            title="Document selection"
            subtitle="List of sales orders"
            data={documentsData}
            columns={[
              { key: 'register', label: 'Register', width: 'w-16' },
              { key: 'document', label: 'Document', width: 'w-32' },
              { key: 'number', label: 'N°', width: 'w-16' },
              { key: 'date', label: 'Date', width: 'w-24' },
              { key: 'customer', label: 'Customers', width: 'flex-1' },
              { key: 'amount', label: 'Amount', width: 'w-24' }
            ]}
            onSelect={(item) => handleSelection(item, 'document')}
            showCustomersButton={true}
            customFooter={
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Folder:</label>
                  <select className="rounded border border-gray-300 px-2 py-1 text-sm">
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Period:</label>
                  <select className="rounded border border-gray-300 px-2 py-1 text-sm">
                    <option>July</option>
                    <option>June</option>
                    <option>May</option>
                    <option>April</option>
                  </select>
                </div>
              </div>
            }
          />
          {/* Receipts Modal */}
          <ReceiptsModal
            isOpen={activeModal === 'receipts'}
            onClose={() => setActiveModal(null)}
            cartItems={cartItems}
            totalAmount={totalAmount}
          />
        </div>
      </div>

      {repriseModal && (
        <RepriseModal
          open={repriseModal}
          onClose={() => setRepriseModal(false)}
          ticketData={getReprisedTicketData}
        />
      )}
    </>
  );
}
