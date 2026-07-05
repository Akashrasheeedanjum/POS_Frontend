"use client";
import React from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Printer, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Supplier } from '@/lib/actions/suppliers.action';
import { CustomSelect } from '@/components/custom-select';
import { toast } from 'sonner';
import { supplierCreateSchema, supplierUpdateSchema } from '@/zodValidationSchemas/supplier.schema';
import { z } from 'zod';


type SelectType = 'edit' | 'add';

interface CustomerDialogProps {
  open: boolean;
  mode: SelectType;
  onChange: (key: string, value: any) => any;
  userData: Supplier | null;
  handleData: () => void
  onClose: () => void
}

const SupplierForm = ({
  open,
  mode,
  onChange,
  userData,
  handleData,
  onClose
}: CustomerDialogProps) => {
  const title = mode === "edit" ? "Edit Supplier" : "New Supplier"

  const supplierSchema = mode === "edit" ? supplierUpdateSchema : supplierCreateSchema
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = () => {

    if (!userData && mode == 'add') {
      toast.error('Please provide values')
      return;
    }
    try {
      supplierSchema.parse(userData);
      setErrors({})
      handleData()
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            fieldErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
    };
  }

  return (
    <>
      <Dialog open={open}
        onOpenChange={onClose}
      >
        <DialogContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="max-w-[95vw] max-h-[95vh] scrollbar-custom overflow-auto p-0 ">
          <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="flex flex-row justify-between items-center bg-[#DAAC95] text-white p-3 rounded-tl-md">
              <CardTitle className="text-black text-xl font-medium">{title}</CardTitle>

            </CardHeader>

            <CardContent className="flex flex-col md:flex-row p-0">
              {/* Left Column */}
              <div className="w-full md:w-[20%] bg-[#EDEEEF] bg-opacity-90 p-5 space-y-6">
                <div>
                  <label className="block text-gray-600 mb-1">VAT number</label>
                  <Input className="mb-2 border-ring border-[1px]"
                    value={userData?.vatNumber}
                    onChange={(e) => onChange('vatNumber', e.target.value)}
                  />
                </div>
              </div>

              {/* Middle Column */}
              <div className="w-full md:w-[60%] p-5 space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="flex justify-between items-center w-[50%]">
                    <label className="text-gray-600 mb-1">
                      No.provided
                    </label>
                    {mode === 'add' ?
                      <Input className='w-[65%]'
                        value={userData?.numberProvided}
                        onChange={(e) => onChange('numberProvided', e.target.value)}
                      /> :
                      <Input className='w-[65%]'
                        value={userData?.numberProvided}
                      />
                    }
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <MapPin size={20} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Printer size={20} />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">
                    Name - Dénomination<span className="text-[#d81b60]">*</span>
                  </label>
                  <Input
                    value={userData?.nameDenomination}
                    onChange={(e) => onChange('nameDenomination', e.target.value)}
                  />
                  {errors.nameDenomination && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.nameDenomination}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Contact</label>
                  <Input
                    value={userData?.contact}
                    onChange={(e) => onChange('contact', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Adresse</label>
                  <Input
                    value={userData?.address}
                    onChange={(e) => onChange('address', e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <label className="block text-gray-600 mb-1">City</label>
                    <div className='w-full'>
                      <CustomSelect
                        type='cities'
                        value={userData?.city?.cityName ?? userData?.city}
                        placeholder='Select or write'
                        allowInput={true}
                        onChange={(val) => onChange("city", val)}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Zip code</label>
                    <Input
                      value={userData?.zipCode}
                      onChange={(e) => onChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>


                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Tel 1</label>
                    <Input className='placeholder:text-gray-300' placeholder='+33 6 12 34 56 78'
                      value={userData?.tel1}
                      onChange={(e) => onChange('tel1', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Tel 2</label>
                    <Input className='placeholder:text-gray-300' placeholder='+33 6 12 34 56 78'
                      value={userData?.tel2}
                      onChange={(e) => onChange('tel2', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Fax</label>
                    <Input className='placeholder:text-gray-300' placeholder='+33 6 12 34 56 78'
                      value={userData?.fax}
                      onChange={(e) => onChange('fax', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Bank account number</label>
                    <Input className='placeholder:text-gray-300' placeholder='FR14 1234 5678'
                      value={userData?.accountNumber}
                      onChange={(e) => onChange('accountNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className='mt-4'>
                  <label className="block text-gray-600 mb-1">E-Mail</label>
                  <Input className='placeholder:text-gray-300' placeholder='info@email.com'
                    value={userData?.email}
                    onChange={(e) => onChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className='mt-4'>
                  <label className="block text-gray-600 mb-1">Remarks</label>
                  <Textarea className="min-h-[100px]"
                    value={userData?.remarks}
                    onChange={(e) => onChange('remarks', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            {/* Action Buttons */}
            <div className="absolute right-5 top-1/3 flex flex-col gap-3">
              <Button
                // onClick={handleData}
                onClick={handleSubmit}
                size="lg">
                <Save className="mr-2" size={18} /> {mode == 'add' ? 'Save' : 'Update'}
              </Button>
              <Button variant="outline" className=" border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                Specific prices
              </Button>
              <Button variant="outline" className=" border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                Crédits-prepaid..
              </Button>
              <Button variant="outline" className=" border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                History stock entries
              </Button>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SupplierForm
