'use client';
import React, { useEffect, useMemo, useState } from 'react';
import SearchFilters from './SearchFilters';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Pen,
  X,
  FileSearch,
  Printer,
  FileText,
  ReceiptEuro,
  Receipt,
  FolderSync,
  Layers,
  User
} from 'lucide-react';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  ColumnResizeMode,
  VisibilityState,
  getPaginationRowModel
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import ScrollableTable from './ScrollableTable';
import {
  filterDocuments,
  setPageLimit,
  setPageNumber
} from '@/app/Redux/Slices/folder/documentSlice';

import { useRouter } from 'next/navigation';
import {
  setSelectedDocument,
  clearSelectedDocument
} from '@/app/Redux/Slices/newDocuments/documentSlice';
import {
  paymentsTableHTMLGenerator,
  receiptTableHTMLGenerator
} from '@/app/dashboard/sales/_components/ReceiptGenerators/HTMLTableGenerators';
import { buildReceiptData } from '@/app/dashboard/sales/_components/cart/receipts-modal';
import { useSession } from '@clerk/nextjs';
import { getprofiles } from '@/lib/actions/profile.actions';
import { getLatestVatVersion } from '@/lib/actions/sales.actions';
import { generatePDF, getSelectedTemplate } from '@/lib/actions/printerSettings.actions';
import {
  openPrintTab,
  templateGenerator
} from '@/app/settings/printer/Helper/printFunction';
import { toast } from 'sonner';
import DocPreviewModal from './DocumentPreviewModal';
import CustomerForm from '@/app/customers/_components/CustomerForm';
import { cityCountryCreation } from '@/app/customers/Helper/handleCityCountryCreation';
import { deepTrimObject } from '@/app/dashboard/suppliers/Helper/deepTrimObject';
import { trackChangedFields } from '@/app/dashboard/suppliers/Helper/TrackChangedFields';
import { transformCustomerData } from '@/app/customers/Helper/transformCustomerData';
import { getAllCities, getAllCountries, getCityById, getCountryById, updateCustomer } from '@/lib/actions/customers.actions';
import { editModalOpen, refreshListOnUpdate } from '@/app/Redux/Slices/customerSlice';
import { ClipLoader } from 'react-spinners';
import DeleteConfirmationModal from '@/components/modal/DeleteConfirmationModal';
import WarningModal from '@/components/modal/WarningModal';
import { deleteDocumentById } from '@/lib/actions/folder.actions';

const MainContent = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token;

  const allDocuments = useSelector(
    (state: RootState) => state.document.allDocuments
  );
  const isDocumentsLoading = useSelector(
    (state: RootState) => state.document.isDocumentsLoading
  );
  const pageNumber = useSelector(
    (state: RootState) => state.document.pageNumberDocuments
  );
  const pageLimit = useSelector(
    (state: RootState) => state.document.pageLimitDocuments
  );
  const docsCount = useSelector(
    (state: RootState) => state.document.documentsCount
  );
  const filterQuery = useSelector((state: RootState) => state.document.query);
  const selectedDoc = useSelector(
    (state: RootState) => state.newdocument.selectedDocument
  );

  const openEditModal = useSelector(
    (state: RootState) => state.customer.openEditModal
  );

  const selectedCustomer = useSelector((state: RootState) => state.customer.selectedCustomer);

  const [userData, setUserData] = useState<any>();
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedDocument, setSelectedDocumentz] = useState<any>(null);
  // console.log("Selected Document in MainContent:", selectedDocument);
  const [columnSizing, setColumnSizing] = useState({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [previewDocContent, setPreviewDocContent] = useState('');
  const [previewDocModalOpen, setPreviewDocModalOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [docCustomerLoading, setDocCustomerLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [WarningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if(selectedCustomer){
      setUserData(selectedCustomer);
      setSelectedRowData(selectedCustomer);
    }else{
      dispatch(filterDocuments({}));
    }
  }, [selectedCustomer]);

  // This effect syncs context value to local state
  // useEffect(() => {
  //   setUserData(selectedCustomer);
  // }, [selectedCustomer]); // runs whenever selectedCustomer changes

  const handleClick = () => {
    router.push('/dashboard/documents');
  };
  const handleEditClick = () => {
    router.push('/dashboard/documents/editdocuments');
  };
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: 'register', header: 'Register', size: 50 },
      { accessorKey: 'receiptType', header: 'Document', size: 150 },
      { accessorKey: 'ticketNumber', header: 'Ticket No.', size: 200 },
      { accessorKey: 'createdAt', header: 'Created Date', size: 130 },
      {
        accessorKey: 'customer.nameDenomination',
        header: 'Customers',
        size: 200
      },
      {
        accessorKey: 'totalAmount_VatIncluded',
        header: 'Total Amount',
        size: 140
      },
      { accessorKey: 'perceivedAmount', header: 'Perceived Amount', size: 160 },
      { accessorKey: 'balanceDue', header: 'Balance Due', size: 140 },
      { accessorKey: 'ToRenderAmount', header: 'To Render', size: 140 },
      {
        accessorKey: 'totalAmount_VatExcluded',
        header: 'Amount VAT excl',
        size: 150
      },
      { accessorKey: 'totalVat_amount', header: 'VAT Amount', size: 140 },
      { accessorKey: 'dueDate', header: 'Due Date', size: 140 },
      { accessorKey: 'paymentMethod', header: 'Payment Method', size: 150 },
      {
        accessorKey: 'customer.customerCode',
        header: 'Customer No.',
        size: 170
      },
      { accessorKey: 'employee.name', header: 'Employee', size: 140 }
    ],
    []
  );

  const paginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageLimit
  };

  const totalItems = Number(docsCount);
  const table = useReactTable({
    data: allDocuments,
    columns,
    pageCount: Math.ceil(totalItems / paginationState.pageSize),
    state: {
      pagination: paginationState,
      columnVisibility,
      columnSizing
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange' as ColumnResizeMode,
    // ✅ UPDATED: Update context values instead of useQueryState
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function' ? updater(paginationState) : updater;
      dispatch(setPageNumber(newState.pageIndex + 1)); //to increase page number in redux
      dispatch(setPageLimit(newState.pageSize)); //to increase page limit in redux

      /*fetch filtered results with same query from redux but different page numbers, 
        Note: Query is changed in searchFilters component*/
      dispatch(
        filterDocuments({
          query: filterQuery,
          page: newState.pageIndex + 1,
          limit: newState.pageSize
        })
      );
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  const handleSelectDocument = ({ data }: { data: any }) => {
    setSelectedDocumentz(data);
    dispatch(setSelectedDocument(data));
    // console.log("Parent received selected document:", userData);
  };

  const handlePreview = async () => {

    setPreviewLoading(true)
    try {
      const doc = selectedDocument || selectedDoc;

      if (doc && (doc.receiptType == 'quote' || doc.receiptType == 'invoice')) {
        if (!token) throw new Error('Session Expired! Re-Login');
        const [profiles, vats, template] = await Promise.all([
          getprofiles(),
          getLatestVatVersion(token),
          getSelectedTemplate()
        ]);

        const enterprise = profiles[0];

        if (!template) throw new Error('Template for preview not found.');

        if (!doc.articles.length)
          throw new Error('No articles found in the selected document.');
        const confirmInvoiceTableDemo = receiptTableHTMLGenerator(
          doc?.articles
        );
        if (!doc.paymentMethods.length)
          throw new Error('No payment methods found in the selected document.');
        const confirmPaymentMethodsDemo = paymentsTableHTMLGenerator(
          doc?.paymentMethods
        );

        if (!doc.customer)
          throw new Error('No customer found in the selected document.');

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = today.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        const receiptData = buildReceiptData({
          enterpriseProfile: enterprise,
          bankAccounts: enterprise.banks ?? [],
          latestVats: vats,
          customerData: doc.customer,
          formattedDate
        });
        receiptData.factureNumber = doc?.ticketNumber;
        receiptData.base1 = doc?.basePrice_withoutVat_1.toFixed(2);
        receiptData.base2 = doc?.basePrice_withoutVat_2.toFixed(2);
        receiptData.base3 = doc?.basePrice_withoutVat_3.toFixed(2);
        receiptData.base4 = doc?.basePrice_withoutVat_4.toFixed(2);
        receiptData.totalHT = doc?.totalAmount_VatExcluded.toFixed(2);
        receiptData.TVA = doc?.totalVat_amount.toFixed(2);
        receiptData.totalTTC = doc?.totalAmount_VatIncluded.toFixed(2);

        const prepareDataForPreview = {
          data: receiptData,
          confirmInvoiceTableDemo: confirmInvoiceTableDemo,
          confirmPaymentMethodsDemo: confirmPaymentMethodsDemo
        };

        const content = await templateGenerator(
          prepareDataForPreview,
          template
        );
        if (content) {
          setPreviewDocContent(content);
          setPreviewDocModalOpen(true);
        } else {
          throw new Error('Error in generating preview content template.');
        }
      } else {
        throw new Error('Invalid selected document!');
      }
    } catch (error) {
      console.error('Error in previewing document:', error);
      toast.error(`${(error as Error).message}`);
      setSelectedDocumentz(null);
      dispatch(clearSelectedDocument());
    }finally{
      setPreviewLoading(false)
    }
  };

  const handlePrint = async () => {
    setPrintLoading(true)
    try {
      const doc = selectedDocument || selectedDoc;

      if (doc) {
        if (!token) throw new Error('Session Expired! Re-Login');
        const [profiles, vats, template] = await Promise.all([
          getprofiles(),
          getLatestVatVersion(token),
          getSelectedTemplate()
        ]);

        const enterprise = profiles[0];

        if (!template) throw new Error('Template for print not found.');

        if (!doc.articles.length)
          throw new Error('No articles found in the selected document.');
        const confirmInvoiceTableDemo = receiptTableHTMLGenerator(
          doc?.articles
        );
        if (!doc.paymentMethods.length)
          throw new Error('No payment methods found in the selected document.');
        const confirmPaymentMethodsDemo = paymentsTableHTMLGenerator(
          doc?.paymentMethods
        );

        if (!doc.customer)
          throw new Error('No customer found in the selected document.');

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = today.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        const receiptData = buildReceiptData({
          enterpriseProfile: enterprise,
          bankAccounts: enterprise.banks ?? [],
          latestVats: vats,
          customerData: doc.customer,
          formattedDate
        });
        receiptData.factureNumber = doc?.ticketNumber;
        receiptData.base1 = doc?.basePrice_withoutVat_1.toFixed(2);
        receiptData.base2 = doc?.basePrice_withoutVat_2.toFixed(2);
        receiptData.base3 = doc?.basePrice_withoutVat_3.toFixed(2);
        receiptData.base4 = doc?.basePrice_withoutVat_4.toFixed(2);
        receiptData.totalHT = doc?.totalAmount_VatExcluded.toFixed(2);
        receiptData.TVA = doc?.totalVat_amount.toFixed(2);
        receiptData.totalTTC = doc?.totalAmount_VatIncluded.toFixed(2);

        const prepareDataForPreview = {
          data: receiptData,
          confirmInvoiceTableDemo: confirmInvoiceTableDemo,
          confirmPaymentMethodsDemo: confirmPaymentMethodsDemo
        };

        await openPrintTab(prepareDataForPreview, template);
      } else {
        throw new Error('Invalid selected document!');
      }
    } catch (error) {
      console.error('Error in printing document:', error);
      toast.error(`${(error as Error).message}`);
      setSelectedDocumentz(null);
      dispatch(clearSelectedDocument());
    }finally{
      setPrintLoading(false)
    }
  };
  const handlePreviewClose = () => {
    setSelectedDocumentz(null);
    dispatch(clearSelectedDocument());
    setPreviewDocModalOpen(false);
  };


  // Deep clone utility
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  const clonedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone((obj as any)[key]);
    }
  }

  return clonedObj;
}

// Your existing constants and functions
const PRICE_LIST_KEYS = [
  "usePriceList1",
  "usePriceList2",
  "usePriceList3",
  "usePriceList4",
];

const setDeepValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  keys.forEach((key) => {
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}; // initialize safely
    }
    current = current[key];
  });

  current[lastKey] = value;
};

  const handleValueChange = (path: string, value: any | boolean) => {
    setUserData((prev: any) => {
      // Deep clone prev to safely update nested properties without mutation issues
      const newData = deepClone(prev);

      if (PRICE_LIST_KEYS.includes(path) && value === true) {
        // Set only the selected key to true, others to false
        PRICE_LIST_KEYS.forEach((key) => {
          newData[key] = key === path;
        });
      } else {
        setDeepValue(newData, path, value);
      }
      return newData;
    });
  };

  const handleEditCustomer = async () => {
    const doc = selectedDocument || selectedDoc;
    setDocCustomerLoading(true)
    try {
    if(!doc) throw new Error('Invalid selected document!');
    if(!doc.customer) throw new Error('Customer not found in selected document!')
    let customer = doc.customer
    customer = {
      ...customer,
      createdAt: new Date(customer.createdAt).toLocaleDateString("en-GB") 
    }
    dispatch(editModalOpen({isModalOpen:true, userData: customer}))
    } catch (error) {
      console.error('Error in edit customer', error);
      toast.error(`${(error as Error).message}`);
    } finally {
      setSelectedDocumentz(null);
      dispatch(clearSelectedDocument());
      setDocCustomerLoading(false)
    }

  };

  const handleUpdate = async() => {
    const {_id} = selectedRowData
    const updatedUserData = await cityCountryCreation(userData)
    const trimmedData = deepTrimObject(updatedUserData);
      const changedFields = trackChangedFields(trimmedData, selectedRowData)
    
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes to update.");
        return;
      }
      
      const data = transformCustomerData(changedFields)
    try {
      const updatedUser = await updateCustomer(_id, data, token)
      dispatch(refreshListOnUpdate(updatedUser))
      handleModalClose()
      toast.success('Customer Updated successfully!')
    } catch (error:any) {
      console.error('Error while updating Customer', error)
      toast.error(`${error?.message}`)
    }
    
  }

  const handleModalClose = () => {
    setSelectedRowData(null)
    setUserData(null)
    dispatch(editModalOpen({isModalOpen:false, userData:null}))
  }

  const handleDeleteDoc = () => {
    const doc = selectedDocument || selectedDoc;
    try {
      if(!doc) throw new Error('Invalid selected document!');
      if(doc.receiptType == 'invoice'){
        setWarningMessage('Denied: Operation not permitted for an invoice .. establish a credit note')
        setWarningModalOpen(true)
        return
      }
      setDeleteModalOpen(true)
    } catch (error) {
      console.error('Error in delete document', error);
      toast.error(`${(error as Error).message}`);
    } 
  }

  const confirmDelete = async () => {
    const doc = selectedDocument || selectedDoc;
    try {
    if(!doc) throw new Error('Selection of document lost, ReSelect!')
    const resp = await deleteDocumentById(doc._id, token)
    if(resp.success){
      dispatch(filterDocuments({}))
      toast.success(`${doc.receiptType?.toUpperCase() || 'Document'} deleted successfully...`)
    }
    } catch (error) {
      console.error('Error in delete document', error);
      toast.error(`${(error as Error).message}`);
    }finally{
      setSelectedDocumentz(null);
      dispatch(clearSelectedDocument());
      setDeleteModalOpen(false)
    }
  }
  const confirmWarning = () => {
    dispatch(clearSelectedDocument());
    setSelectedDocumentz(null);
    setWarningModalOpen(false)
  }


    const handlePdfGenerate = async () => {

    setPdfLoading(true)
    try {
      const doc = selectedDocument || selectedDoc;

      if (doc && (doc.receiptType == 'quote' || doc.receiptType == 'invoice')) {
        if (!token) throw new Error('Session Expired! Re-Login');
        const [profiles, vats, template] = await Promise.all([
          getprofiles(),
          getLatestVatVersion(token),
          getSelectedTemplate()
        ]);

        const enterprise = profiles[0];

        if (!template) throw new Error('Template for pdf not found.');

        if (!doc.articles.length)
          throw new Error('No articles found in the selected document.');
        const confirmInvoiceTableDemo = receiptTableHTMLGenerator(
          doc?.articles
        );
        if (!doc.paymentMethods.length)
          throw new Error('No payment methods found in the selected document.');
        const confirmPaymentMethodsDemo = paymentsTableHTMLGenerator(
          doc?.paymentMethods
        );

        if (!doc.customer)
          throw new Error('No customer found in the selected document.');

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = today.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        const receiptData = buildReceiptData({
          enterpriseProfile: enterprise,
          bankAccounts: enterprise.banks ?? [],
          latestVats: vats,
          customerData: doc.customer,
          formattedDate
        });
        receiptData.factureNumber = doc?.ticketNumber;
        receiptData.base1 = doc?.basePrice_withoutVat_1.toFixed(2);
        receiptData.base2 = doc?.basePrice_withoutVat_2.toFixed(2);
        receiptData.base3 = doc?.basePrice_withoutVat_3.toFixed(2);
        receiptData.base4 = doc?.basePrice_withoutVat_4.toFixed(2);
        receiptData.totalHT = doc?.totalAmount_VatExcluded.toFixed(2);
        receiptData.TVA = doc?.totalVat_amount.toFixed(2);
        receiptData.totalTTC = doc?.totalAmount_VatIncluded.toFixed(2);

        const prepareDataForPreview = {
          data: receiptData,
          confirmInvoiceTableDemo: confirmInvoiceTableDemo,
          confirmPaymentMethodsDemo: confirmPaymentMethodsDemo
        };

        const content = await templateGenerator(
          prepareDataForPreview,
          template
        );
        if (content) {
          const pdfName = receiptData.factureNumber ?? 'Document'
          await generatePDF(pdfName, content)
        } else {
          throw new Error('Error in generating PDF');
        }
      } else {
        throw new Error('Invalid selected document!');
      }
    } catch (error) {
      console.error('Error in making PDF:', error);
      toast.error(`${(error as Error).message}`);
      setSelectedDocumentz(null);
      dispatch(clearSelectedDocument());
    }finally{
      setPdfLoading(false)
    }
  };

  return (
    <>

    {
      deleteModalOpen && (
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Remove? ${selectedDocument.ticketNumber || selectedDoc.ticketNumber}`}
      />
      )
    }
    {
      WarningModalOpen && (
      <WarningModal
        open={WarningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onConfirm={confirmWarning}
        message={`${warningMessage}`}
      />
      )
    }
      {previewDocContent && previewDocModalOpen && (
        <DocPreviewModal
          open={previewDocModalOpen}
          onClose={handlePreviewClose}
          title={`Preview - ${
            selectedDocument?.ticketNumber || selectedDoc?.ticketNumber
          }`}
          htmlContent={previewDocContent}
        />
      )}

      {openEditModal && (
        <CustomerForm
          open={openEditModal}
          mode="edit"
          onChange={handleValueChange}
          userData={userData}
          handleData={handleUpdate}
          onClose={handleModalClose}
        />
      )}
      <div className=" scrollbar-custom h-[calc(100dvh-56px)] overflow-y-auto">
        <SearchFilters />
        <div className="flex flex-col items-center gap-4 lg:items-start NLP:flex-row LS:justify-center">
          <div className="w-[100%] px-4 pt-4 NLP:w-[78%] NLP:px-0 NLP:pl-4">
            <ScrollableTable
              table={table}
              isDataLoading={isDocumentsLoading}
              pageNumber={pageNumber}
              pageLimit={pageLimit}
              dataCount={docsCount}
              selectRowDataForRedux={handleSelectDocument}
            />
          </div>

          <div className="overflow-x-hidden pb-4 pt-4 NLP:border-l-2 NLP:pl-2">
            <div className="flex flex-col gap-2 ELMB:flex-row ELMB:justify-center NLP:flex-col NLP:justify-start">
              <button
                className="flex w-[150px] items-center gap-4  rounded-md bg-primary py-2 pl-2 font-medium text-primary-foreground hover:bg-primary/90 lg:w-[180px]"
                onClick={handleClick}
              >
                <Plus className="h-4 w-4" />{' '}
                <span className="text-[14px]">New document</span>
              </button>

              <button
                className="flex w-[150px]  items-center  gap-4  rounded-md bg-blue-500 py-2 pl-2 font-medium text-primary-foreground hover:bg-blue-500/90 lg:w-[180px]"
                onClick={handleEditClick}
              >
                <Pen className="h-4 w-4" />{' '}
                <span className="text-[14px]">Edit</span>
              </button>

              <button 
              onClick={handleDeleteDoc}
              className="flex w-[150px]  items-center  gap-4  rounded-md bg-red-500/80 py-2 pl-2 font-medium text-primary-foreground transition-all duration-300 hover:bg-red-500 lg:w-[180px]">
                <X className="h-4 w-4" />{' '}
                <span className="text-[14px]">Delete</span>
              </button>
            </div>

            <div className="mt-2 flex flex-col gap-2 ELMB:flex-row ELMB:justify-center NLP:flex-col NLP:justify-start">
              <p className="mb-2 hidden border-b-2 pb-2 NLP:block">Files</p>
              <button
                onClick={handlePreview}
                disabled={previewLoading}
                className={`${previewLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} flex w-[150px]  items-center  gap-4  rounded-md py-2 pl-2 font-medium text-primary-foreground  lg:w-[180px]`}
              >
              {previewLoading ? 
                <span className='flex justify-center w-full'>
              <ClipLoader size={15} /> 
                </span>
              : <>
              <FileSearch className="h-4 w-4" />{' '}
              <span className="text-[14px]">Preview</span>
              </>}   
              </button>

              <button
              disabled={printLoading}
                onClick={handlePrint}
                className={`${printLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} flex w-[150px]  items-center  gap-4  rounded-md py-2 pl-2 font-medium text-primary-foreground  lg:w-[180px]`}
              >
                {printLoading ? 
                <span className='flex justify-center w-full'>
              <ClipLoader size={15} /> 
                </span>
              : <>
              <Printer className="h-4 w-4" />{' '}
              <span className="text-[14px]">Print</span>
              </>}
              </button>

              <button 
              disabled={pdfLoading}
              className={`${pdfLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} flex w-[150px]  items-center  gap-4  rounded-md py-2 pl-2 font-medium text-primary-foreground  lg:w-[180px]`}
              onClick={handlePdfGenerate}>
              {pdfLoading ? 
                <span className='flex justify-center w-full'>
              <ClipLoader size={15} /> 
                </span>
              : <>
              <FileText className="h-4 w-4" />{' '}
                <span className="text-[14px]">PDF</span>
              </>}
              </button>
            </div>

            <div className="mt-4 flex w-full flex-col gap-2 border-t-2 pt-4 ELMB:flex-row ELMB:flex-wrap ELMB:justify-center  NLP:flex-col NLP:justify-start">
              {/* <button className="flex w-[150px]  items-center gap-4 rounded-md  border border-red-500  bg-white py-2 pl-2 font-medium text-red-500 hover:bg-gray-100/70 ELMB:w-[130px] ELMB:gap-2 lg:gap-4 NLP:w-[180px]">
                <Receipt className="h-4 w-4 rotate-45" />{' '}
                <span className="text-[14px]">Save Payment</span>
              </button> */}

              <button className="flex w-[150px]  items-center gap-4 rounded-md  bg-primary py-2 pl-2 font-medium text-primary-foreground hover:bg-primary/90 ELMB:w-[130px] ELMB:gap-2 lg:gap-4 NLP:w-[180px]">
                <FolderSync className="h-4 w-4" />{' '}
                <span className="text-[14px]">Transform</span>
              </button>

              {/* <button className="flex w-[150px]  items-center gap-4 rounded-md   bg-primary  py-2 pl-2 font-medium text-primary-foreground hover:bg-primary/90 ELMB:gap-2 lg:gap-4 NLP:w-[180px]">
                <Layers className="h-4 w-4" />{' '}
                <span className="text-[10px] NLP:text-[14px]">
                  Group Delivery Note
                </span>
              </button> */}

              <button
              disabled={docCustomerLoading}
                onClick={handleEditCustomer}
                className={`${docCustomerLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} flex w-[150px] items-center gap-4 rounded-md  py-2 pl-2 font-medium text-primary-foreground  ELMB:gap-2 lg:gap-2 NLP:w-[180px] `}
              >
              {docCustomerLoading ? 
                <span className='flex justify-center w-full'>
              <ClipLoader size={15} /> 
                </span>
              : <>
              <User className="h-4 w-4" />{' '}
                <span className="text-[10px] NLP:text-[14px]">
                  Customer of Document
                </span>
              </>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;
