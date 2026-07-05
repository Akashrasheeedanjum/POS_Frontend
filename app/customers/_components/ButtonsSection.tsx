'use client';
import { Button } from '@/components/ui/button';
import { FileUp, Plus, PrinterCheck } from 'lucide-react';
import React, { useState } from 'react'
import { Separator } from '@/components/ui/separator';
import { transformCustomerData } from '../Helper/transformCustomerData';
import { createCity, createCustomer, getNewCustomerNumber } from '@/lib/actions/customers.actions';
import { toast } from 'sonner';
import { generateCustomersXml } from './CustomerXmlGenerator';

import { useDispatch, useSelector } from 'react-redux';
import CustomerForm from './CustomerForm';
import { addCustomer, setIsAddNewUser } from '@/app/Redux/Slices/customerSlice';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { deepTrimObject } from '@/app/dashboard/suppliers/Helper/deepTrimObject';
import { cityCountryCreation } from '../Helper/handleCityCountryCreation';
import { useSession } from '@clerk/nextjs';
import { customersTableHTMLGenerator } from './CustomerTableGenerator';
import { printSimpleHtml } from '../Helper/PrintSimpleHtml';
import { generatePDF } from '@/lib/actions/printerSettings.actions';
import { getDefaultCustomerFormData } from '../Helper/getDefaultCustomerFormData';
import { ClipLoader } from 'react-spinners';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
const ButtonsSection = () => {

  const { session } = useSession();
  const userAccesses: any = session?.user?.publicMetadata?.accesses
  const userRole: any = session?.user?.publicMetadata?.role

  const token: any = session?.user?.publicMetadata?.token

  // const {addCustomer} = useCustomerManagement()
  const dispatch = useDispatch<AppDispatch>();
  const isAddNewUser = useSelector((state: RootState) => state.customer.IsAddNewUser);
  const allCustomers = useSelector((state: RootState) => state.customer.allCustomers);

  const [userData, setUserData] = useState<any>()
  const [newCode, setNewCode] = useState<any>()
  const [pdfLoading, setPdfLoading] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState<"pdf" | "xml" | "csv" | null>(null);
  const setDeepValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const deepRef = keys.reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, obj);
    deepRef[lastKey] = value;
  };

  const PRICE_LIST_KEYS = [
    "usePriceList1",
    "usePriceList2",
    "usePriceList3",
    "usePriceList4",
  ];

  const handleValueChange = (path: string, value: any | boolean) => {
    setUserData((prev: any) => {
      const newData = { ...prev };

      // If the field being updated is one of the usePriceList switches
      if (PRICE_LIST_KEYS.includes(path) && value === true) {
        // Set only the selected key to true, others to false
        PRICE_LIST_KEYS.forEach((key) => {
          newData[key] = key === path;
        });
      } else {
        // For all other cases, do a regular update
        setDeepValue(newData, path, value);
      }

      return newData;
    });
  };



  const handleSave = async () => {

    const updatedUserData = await cityCountryCreation(userData)
    // return
    const trimmedData = deepTrimObject(updatedUserData);
    const data = transformCustomerData(trimmedData)
    try {
      if (!data?.customerCode) {
        data.customerCode = String(newCode)
      }
      const newCustomer = await createCustomer(data, token)
      dispatch(addCustomer(newCustomer))
      toast.success('Customer created successfully!')
      handleModalClose()
    } catch (error) {
      console.error('Error while creating a new Customer', error)
      toast.error(`Error ${error}`)
    }

  }

  const handleModalClose = () => {
    dispatch(setIsAddNewUser(false))
    setUserData(getDefaultCustomerFormData())
    setNewCode(undefined)
  }

  const handleAddCustomer = async () => {
    try {
      const newCustCode = await getNewCustomerNumber(token)
      if (newCustCode) {
        setNewCode(newCustCode)
        setUserData(getDefaultCustomerFormData(newCustCode))
      } else {
        setUserData(getDefaultCustomerFormData())
      }
      dispatch(setIsAddNewUser(true))

    } catch (error) {
      console.error(error)
      setUserData(getDefaultCustomerFormData())
      dispatch(setIsAddNewUser(true))
      toast.error('Using manual customer code')
    }
  }

  const handleCustomerPrint = async () => {
    try {
      if (allCustomers.length > 0) {
        const htmlContent = customersTableHTMLGenerator(allCustomers)
        if (!htmlContent) {
          console.error('Unable to generate HTML')
          return
        }

        await printSimpleHtml('customersList', htmlContent)
      }

    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

  }

  const handleExportPDF = async () => {
    setPdfLoading(true)
    try {
      if (allCustomers.length > 0) {
        const htmlContent = customersTableHTMLGenerator(allCustomers)
        if (!htmlContent) throw new Error('Unable to generate HTML')
        else if (htmlContent) {
          const pdfName = 'Customers List'
          await generatePDF(pdfName, htmlContent)
        }

      }

    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setPdfLoading(false)
    }

  }
const handleExportXML = async () => {
  if (!allCustomers || allCustomers.length === 0) {
    toast.error('No customers to export');
    return;
  }

  try {
    const xmlString = generateCustomersXml(allCustomers);
    if (!xmlString) {
      toast.error('Unable to generate XML');
      return;
    }

    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.xml';
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error(error);
    toast.error('Failed to export XML');
  }
};
  return (
    <>
      {/* <div className='my-4 flex flex-col md:flex-row md:justify-end md:self-end gap-2'> */}
      <div className='my-4 flex flex-col LMB:flex-row LMB:justify-center md:justify-end md:self-end gap-2 lg:mr-3 xl:mr-0'>
        <Button
          disabled={exportLoading !== null}
          className={`${exportLoading ? 'bg-primary/50 cursor-not-allowed' : ''} text-[14px] md:text-[1rem]`}
          onClick={() => setExportModalOpen(true)}
        >
          {exportLoading ? (
            <span className="flex justify-center w-full">
              <ClipLoader size={15} />
            </span>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" /> Export
            </>
          )}
        </Button>
        <Button onClick={handleCustomerPrint} className='text-[14px] md:text-[1rem] '><PrinterCheck className="mr-2 h-4 w-4" /> Print List</Button>

        <Button type='button'
          onClick={handleAddCustomer}
        >
          <Plus className="mr-2 h-4 w-4" /> <div className="text-[14px] md:text-[1rem]">Add New</div>
        </Button>

        {isAddNewUser && (userRole == 'admin' || userAccesses?.customerAccess === true) && (
          <CustomerForm
            newCode={newCode}
            open={isAddNewUser}
            mode='add'
            onChange={handleValueChange}
            userData={userData}
            handleData={handleSave}
            onClose={handleModalClose}
          />
        )}
      </div>
      <Separator />
      <AlertDialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export customers list</AlertDialogTitle>
            <AlertDialogDescription>
              Choose the format you want to export the customers list in.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            {/* PDF */}
            <Button
              variant="default"
              disabled={exportLoading === "pdf"}
              onClick={async () => {
                try {
                  setExportLoading("pdf");
                  await handleExportPDF();  // use your existing function
                  setExportModalOpen(false);
                } finally {
                  setExportLoading(null);
                }
              }}
            >
              {exportLoading === "pdf" ? (
                <span className="flex justify-center w-full">
                  <ClipLoader size={15} />
                </span>
              ) : (
                "Export as PDF"
              )}
            </Button>

            {/* XML */}
            <Button
              variant="outline"
              disabled={exportLoading === "xml"}
              onClick={async () => {
                try {
                  setExportLoading("xml");
                await handleExportXML();
                  setExportModalOpen(false);
                } finally {
                  setExportLoading(null);
                }
              }}
            >
              Export as XML
            </Button>

            {/* CSV */}
            <Button
              variant="outline"
              disabled={exportLoading === "csv"}
              onClick={async () => {
                try {
                  setExportLoading("csv");
                  // TODO: implement handleExportCSV() when ready
                  toast.info("CSV export not implemented yet");
                  setExportModalOpen(false);
                } finally {
                  setExportLoading(null);
                }
              }}
            >
              Export as CSV
            </Button>
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={exportLoading !== null}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ButtonsSection
