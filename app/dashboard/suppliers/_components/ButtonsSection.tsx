'use client';
import { Button } from '@/components/ui/button';
import { FileUp, Plus, PrinterCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';

import { useDispatch, useSelector } from 'react-redux';
import SupplierForm from './SupplierForm';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { addSupplier, setIsAddNewUser } from '@/app/Redux/Slices/supplierSlice';
import { createSupplier } from '@/lib/actions/suppliers.action';
import { toast } from 'sonner';
import { transformSupplierData } from '../Helper/transformSupplierData';
import { deepTrimObject } from '../Helper/deepTrimObject';
import { supplierCityCountryCreation } from '../Helper/handleCityCountryCreation';
import { useSession } from '@clerk/nextjs';
import { ClipLoader } from 'react-spinners';
import {
  customersTableHTMLGenerator,
  suppliersTableHTMLGenerator
} from '@/app/customers/_components/CustomerTableGenerator';
import { generatePDF } from '@/lib/actions/printerSettings.actions';
import { printSimpleHtml } from '@/app/customers/Helper/PrintSimpleHtml';

const ButtonsSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAddNewUser = useSelector(
    (state: RootState) => state.supplier.IsAddNewUser
  );
  const allSuppliers = useSelector(
    (state: RootState) => state.supplier.allSuppliers
  );

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token;

  const [userData, setUserData] = useState<any>();
  const [pdfLoading, setPdfLoading] = useState(false);

  const setDeepValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const deepRef = keys.reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, obj);
    deepRef[lastKey] = value;
  };

  const handleValueChange = (path: string, value: any | boolean) => {
    setUserData((prev: any) => {
      const newData = { ...prev };
      setDeepValue(newData, path, value);
      return newData;
    });
  };

  const handleSave = async () => {
    const updatedUserData = await supplierCityCountryCreation(userData);

    const trimmedData = deepTrimObject(updatedUserData);
    const data = transformSupplierData(trimmedData);

    try {
      const newSupplier = await createSupplier(data, token);
      dispatch(addSupplier(newSupplier));
      toast.success('Supplier created successfully!');
      handleModalClose();
    } catch (error) {
      console.error('Error while creating a new Supplier', error);
      toast.error(`Error ${error}`);
    }
  };

  const handleModalClose = () => {
    dispatch(setIsAddNewUser(false));
    setUserData({});
  };

  const handleSuppliersPrint = async () => {
    try {
      if (allSuppliers.length > 0) {
        const htmlContent = suppliersTableHTMLGenerator(allSuppliers);
        if (!htmlContent) throw new Error('Unable to generate HTML');

        await printSimpleHtml('suppliersList', htmlContent);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      if (allSuppliers.length > 0) {
        const htmlContent = suppliersTableHTMLGenerator(allSuppliers);
        if (!htmlContent) throw new Error('Unable to generate HTML');
        else if (htmlContent) {
          const pdfName = 'Suppliers List';
          await generatePDF(pdfName, htmlContent);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      {/* <div className='my-4 flex flex-col md:flex-row md:justify-end md:self-end gap-2'> */}
      <div className="my-4 flex flex-col gap-2 LMB:flex-row LMB:justify-center md:justify-end md:self-end lg:mr-3 xl:mr-0">
        <Button
          disabled={pdfLoading}
          className={`${
            pdfLoading ? 'cursor-not-allowed bg-primary/50' : ''
          } text-[14px] md:text-[1rem]`}
          onClick={handleExportPDF}
        >
          {pdfLoading ? (
            <span className="flex w-full justify-center">
              <ClipLoader size={15} />
            </span>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" /> Export
            </>
          )}
        </Button>
        <Button onClick={handleSuppliersPrint} className="text-[14px] md:text-[1rem] ">
          <PrinterCheck className="mr-2 h-4 w-4" /> Print List
        </Button>
        <Button type="button" onClick={() => dispatch(setIsAddNewUser(true))}>
          <Plus className="mr-2 h-4 w-4" />{' '}
          <div className="text-[14px] md:text-[1rem]">Add New</div>
        </Button>
        <SupplierForm
          open={isAddNewUser}
          mode="add"
          onChange={handleValueChange}
          userData={userData}
          handleData={handleSave}
          onClose={handleModalClose}
        />
      </div>
      <Separator />
    </>
  );
};

export default ButtonsSection;
