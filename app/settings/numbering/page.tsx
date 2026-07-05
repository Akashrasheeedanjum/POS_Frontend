'use client'
import React, { useEffect, useState } from 'react'
import AutomaticNumbering from './_components/automatic-numbering'

import DocumentNumbers from './_components/document-numbers'
import NotesPanel from './_components/notes-panel'
import { getAllNumbering, updateNumbering } from '@/lib/actions/numbering.actions'
import { toast } from 'sonner'
import { HashLoader } from 'react-spinners'

export interface NumberingData {
  articles: boolean;
  customers: boolean;
  suppliers: boolean;
  receipts: number;
  invoices: number;
  creditNotes: number;
  quotations: number;
  salesOrders: number;
  deliveryNotes: number;
  supplierOrders: number;
  repairOrders: number;
  _id?: string;
  __v?: number;
}

const NumberingPage = () => {
  // Initial data would typically come from an API fetch
  const initialData: NumberingData = {
    articles: true,
    customers: true,
    suppliers: true,
    receipts: 7,
    invoices: 2,
    creditNotes: 0,
    quotations: 0,
    salesOrders: 0,
    deliveryNotes: 1,
    supplierOrders: 0,
    repairOrders: 0,
    _id: "67fb8cc41032c33e9ca435cb",
    __v: 0
  };

  const [numberingData, setNumberingData] = useState<NumberingData>(initialData);
  const [IsUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNumberingData = async () => {
    try {
      setIsLoading(true)
      const data = await getAllNumbering();      
      setNumberingData(data[0]);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching Numbering Data:", error)
      toast.error("Failed to fetch Numbering Data")
      
    }

  }

  useEffect(() => {
    fetchNumberingData();
  }, [])


  const handleToggleChange = (field: keyof NumberingData, value: boolean) => {
    setNumberingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: keyof NumberingData, value: number) => {
    setNumberingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Here you would typically make an API call to save the data
      // await api.updateNumbering(numberingData);
      const { _id, __v, ...dataToSend } = numberingData;
      // console.log('Data to be saved:', dataToSend);
      // Show success message
      await updateNumbering(numberingData?._id, dataToSend);
      toast.success("Numbering data updated successfully")
    } catch (error) {
      console.error('Error saving numbering data:', error);
      toast.error("Failed to update numbering data")
      // Show error message
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
    <HashLoader color="#E4D8D2" size={60}/>
    </div>
  }

  if (!numberingData) {
    return <div className="flex justify-center items-center h-full">
      <div className="text-center text-red-500">
      No Numbering Data found.
      </div>
      </div>
  }

  return (
    <div className="container mx-auto h-full max-h-screen overflow-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-primary">Numbering</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-20">
        <div className="lg:col-span-3 space-y-6">
          <AutomaticNumbering
            data={{
              articles: numberingData?.articles,
              customers: numberingData?.customers,
              suppliers: numberingData?.suppliers
            }}
            onToggleChange={handleToggleChange}
          />
          <DocumentNumbers
            data={{
              receipts: numberingData?.receipts,
              invoices: numberingData?.invoices,
              creditNotes: numberingData?.creditNotes,
              quotations: numberingData?.quotations,
              salesOrders: numberingData?.salesOrders,
              deliveryNotes: numberingData?.deliveryNotes,
              supplierOrders: numberingData?.supplierOrders,
              repairOrders: numberingData?.repairOrders
            }}
            onNumberChange={handleNumberChange}
            onSave={handleSave}
            isLoading={IsUpdating}
          />
        </div>

        <div className="lg:col-span-1">
          <NotesPanel />
        </div>
      </div>
    </div>
  );
}

export default NumberingPage;