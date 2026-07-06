import React from 'react'
import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Customer } from '@/lib/actions/customers.actions';
import { MapPin, Printer, Save } from 'lucide-react';
import { toast } from 'sonner';
import { customerCreateSchema, customerUpdateSchema } from '@/zodValidationSchemas/customer.schema';
import { z } from 'zod';
import { singleCustomerDetails } from './CustomerTableGenerator';
import { printSimpleHtml } from '../Helper/PrintSimpleHtml';


type SelectType = 'edit' | 'add';

interface CustomerDialogProps {
  newCode?: number;
  open: boolean;
  mode: SelectType;
  onChange: (key: string, value: any) => void;
  userData: Partial<Customer> | null;
  // setUserData: (userData: Supplier | null) => void;
  handleData: () => void
  onClose: () => void
}

const CustomerForm = ({
  newCode,
  open,
  mode,
  onChange,
  userData,
  // setUserData,
  handleData,
  onClose
}: CustomerDialogProps) => {
  const title = mode === "edit" ? "Edit Customer" : "New Customer";
  const formData: Partial<Customer> = userData ?? {};

    const customerSchema = mode === "edit" ? customerUpdateSchema : customerCreateSchema
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    
const handleSubmit = () => {
  const dataToValidate: Partial<Customer> = userData ?? formData;
  if (!dataToValidate?.nameDenomination?.trim() && mode === 'add') {
    toast.error('Please provide customer name');
    return;
  }
  
  try {
    customerSchema.parse(dataToValidate);
    setErrors({});
    handleData();
  } catch (err) {
    if (err instanceof z.ZodError) {
      toast.error(`${err.message}`);
      const fieldErrors: Record<string, string> = {};

        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            const fieldPath = e.path.join('.'); // handles nested fields
            fieldErrors[fieldPath] = e.message;
          }
        });

        setErrors(fieldErrors);
      }
    }
  };

const printCustomer = async () =>{
  if(!userData) {
    toast.error('Unable to get customerData!')
    return
  }
   try {
     if(userData){
   const htmlContent = singleCustomerDetails(userData)
   if(!htmlContent){
     console.error('Unable to generate HTML')
     return
   }

        await printSimpleHtml(`${formData.nameDenomination} details`, htmlContent)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <>
      <Dialog
        open={open}
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
                  <label className="block text-gray-600 mb-1">NTN / GST No.</label>
                  <Input className="mb-2 border-ring border-[1px]"
                    value={formData.vatNumber ?? ''}
                    onChange={(e) => onChange('vatNumber', e.target.value)}
                  />
                  {errors["vatNumber"] && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors["vatNumber"]}
                    </span>
                  )}
                </div>
                {mode === 'edit' ?
                  <div>
                    <label className="block text-gray-600 mb-1">Registration date</label>
                    <Input
                      className='border-ring border-[1px] placeholder:text-gray-400'
                      placeholder='dd/mm/yyyy'
                      value={formData.createdAt}
                    />
                  </div>
                  : null
                }
                <div className='flex justify-between'>
                  <Label htmlFor="Bill without GST" className="text-gray-600">
                    Bill without GST
                  </Label>
                  <div className='flex items-center'>
                    <Switch
                      id="billWithoutVat"
                      checked={formData.billWithoutVat ?? false}
                      onCheckedChange={(checked) => onChange('billWithoutVat', checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.billWithoutVat ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Label htmlFor="Use Prices list 1" className="text-gray-600">
                    Use Prices list 1
                  </Label>
                  <div className='flex items-center'>
                    <Switch
                      id="usePriceList1"
                      checked={formData.usePriceList1 ?? false}
                      onCheckedChange={(checked) => onChange('usePriceList1', checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.usePriceList1 ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Label htmlFor="Use Prices list 2" className="text-gray-600">
                    Use Prices list 2
                  </Label>
                  <div className='flex items-center'>
                    <Switch
                      id="usePriceList2"
                      checked={formData.usePriceList2}
                      onCheckedChange={(checked) => onChange('usePriceList2', checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.usePriceList2 ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Label htmlFor="Use Prices list 3" className="text-gray-600">
                    Use Prices list 3
                  </Label>
                  <div className='flex items-center'>
                    <Switch
                      id="usePriceList3"
                      checked={formData.usePriceList3}
                      onCheckedChange={(checked) => onChange('usePriceList3', checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.usePriceList3 ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Label htmlFor="Use Prices list 4" className="text-gray-600">
                    Use Prices list 4
                  </Label>
                  <div className='flex items-center'>
                    <Switch
                      id="usePriceList4"
                      checked={formData.usePriceList4}
                      onCheckedChange={(checked) => onChange('usePriceList4', checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.usePriceList4 ? "On" : "Off"}
                    </span>
                  </div>
                </div>
                {errors["usePriceList"] && (
                  <span className="text-red-500 text-sm mt-1">{errors["usePriceList"]}</span>
                )}

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Permanent discount</label>
                  <label className="block text-gray-600 mb-1 text-sm">% Discount based on rate 1</label>
                  <Input className='border-ring border-[1px]'
                    type='number'
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    value={formData.permanentDiscount}
                    onChange={(e) => onChange('permanentDiscount', Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Fidelity</label>
                  <label className="block text-gray-600 mb-1 text-sm">Total accumulated purchases</label>
                  <Input className='border-ring border-[1px]'
                    type='number'
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    value={formData.fidelity}
                    onChange={(e) => onChange('fidelity', Number(e.target.value))}
                  />
                </div>

                <div className='flex justify-between'>
                  <Label htmlFor="Block Client" className="text-gray-600">
                    Block Client
                  </Label>
                  <div className='flex items-center'>
                    <Switch
                      id="blockClient"
                      checked={formData.blockClient}
                      onCheckedChange={(checked) => onChange('blockClient', checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.blockClient ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="w-full md:w-[55%] p-5 space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="flex justify-between items-center w-[50%]">
                    <label className="text-gray-600 mb-1">
                      Customer N°<span className="text-[#d81b60]">*</span>
                    </label>
                    {mode === 'add' ?
                      <Input className='w-[65%]'
                        value={formData.customerCode ?? newCode ?? 0}
                        onChange={(e) => onChange('customerCode', e.target.value)}
                      /> :
                      <Input className='w-[65%]'
                        value={formData.customerCode}
                      />
                    }
                  </div>
                  {mode == 'edit' &&
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <MapPin size={20} />
                      </Button>
                      <Button onClick={printCustomer} variant="ghost" size="icon">
                        <Printer size={20} />
                      </Button>
                    </div>
                  }
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">
                    Name - Dénomination<span className="text-[#d81b60]">*</span>
                  </label>
                  <Input
                    value={formData.nameDenomination}
                    onChange={(e) => onChange('nameDenomination', e.target.value)}
                  />
                  {errors["nameDenomination"] && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors["nameDenomination"]}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">First name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => onChange('firstName', e.target.value)}
                  />
                  {/* {errors["firstName"] && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors["firstName"] }
                  </span>
                )} */}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">EO-ID</label>
                  <Input
                    value={formData.EOID}
                    onChange={(e) => onChange('EOID', e.target.value)}
                  />
                  {/* {errors["EOID"] && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors["EOID"] }
                  </span>
                )} */}
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">F-ID </label>
                  <Input
                    value={formData.FID}
                    onChange={(e) => onChange('FID', e.target.value)}
                  />
                  {/* {errors["FID"] && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors["FID"] }
                  </span>
                )} */}
                </div>
                <Tabs defaultValue="billing">
                  <TabsList className="bg-transparent w-auto h-auto p-0 mb-4">
                    <TabsTrigger
                      value="billing"
                      className="px-4 py-2 data-[state=active]:bg-[#EDEEEF] data-[state=active]:text-gray-800 rounded-t-md border border-gray-300 data-[state=active]:border-b-0"
                    >
                      Billing
                    </TabsTrigger>
                    <TabsTrigger
                      value="delivery"
                      className="ml-4 px-4 py-2 data-[state=active]:bg-[#EDEEEF] data-[state=active]:text-gray-800 rounded-t-md border border-gray-300 data-[state=active]:border-b-0"
                    >
                      Delivery
                    </TabsTrigger>
                  </TabsList>
                  {/* billing address fields */}
                  <TabsContent value="billing" className="mt-0 p-0 space-y-4">
                    <div>
                      <label className="block text-gray-600 mb-1">Adresse</label>
                      <Input
                        value={formData.billingAddress?.address}
                        onChange={(e) => onChange('billingAddress.address', e.target.value)}
                      />
                      {errors["billingAddress.address"] && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors["billingAddress.address"]}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <label className="block text-gray-600 mb-1">City</label>
                        <div className='w-full'>
                          <CustomSelect type='cities'
                            placeholder='Select or write'
                            allowInput={true}
                            value={formData.billingAddress?.city?.cityName ?? formData.billingAddress?.city}
                            onChange={(val) => onChange("billingAddress.city", val)} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Zip code</label>
                        <Input
                          value={formData.billingAddress?.zipCode}
                          onChange={(e) => onChange('billingAddress.zipCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* delivery address fields */}
                  <TabsContent value="delivery" className="mt-0 p-0 space-y-4">
                    {/* <p className='text-center text-[#d81b60] text-[12px]'>For Delivery</p> */}
                    <div>
                      <label className="block text-gray-600 mb-1">Delivery Adresse</label>
                      <Input
                        value={formData.deliveryAddress?.address}
                        onChange={(e) => onChange('deliveryAddress.address', e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <label className="block text-gray-600 mb-1">Delivery City</label>
                        <div className='w-full'>
                          <CustomSelect type='cities'
                            allowInput={true}
                            placeholder='Select or write'
                            value={formData.deliveryAddress?.city?.cityName ?? formData.deliveryAddress?.city}
                            onChange={(val) => onChange("deliveryAddress.city", val)} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Delivery Zip code</label>
                        <Input
                          value={formData.deliveryAddress?.zipCode}
                          onChange={(e) => onChange('deliveryAddress.zipCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <div className="relative mt-4">
                    <label className="block text-gray-600 mb-1">Country</label>
                    <div className='w-full'>
                      <CustomSelect type='countries'
                        allowInput={true}
                        value={formData.country?.countryName ?? formData.country}
                        onChange={(val) => onChange("country", val)}
                        placeholder='Select or write' />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                      <label className="block text-gray-600 mb-1">Tel 1</label>
                      <Input className='placeholder:text-gray-300' placeholder='+92 300 1234567'
                        value={formData.tel1 ?? ''}
                        onChange={(e) => onChange('tel1', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-600 mb-1">Tel 2</label>
                      <Input className='placeholder:text-gray-300' placeholder='+92 300 1234567'
                        value={formData.tel2 ?? ''}
                        onChange={(e) => onChange('tel2', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label className="block text-gray-600 mb-1">E-Mail</label>
                    <Input className='placeholder:text-gray-300' placeholder='info@email.com'
                      value={formData.email}
                      onChange={(e) => onChange('email', e.target.value)}
                    />
                    {/* {errors["email"]  && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors["email"]}
                  </span>
                )} */}
                  </div>

                  <div className='mt-4'>
                    <label className="block text-gray-600 mb-1">Remarks</label>
                    <Textarea className="min-h-[100px]"
                      value={formData.remarks}
                      onChange={(e) => onChange('remarks', e.target.value)}
                    />
                  </div>
                </Tabs>
              </div>

              {/* Right Column - Action Buttons */}
              <div className="w-full md:w-[25%] bg-[#F8F9FA] p-5 flex flex-col gap-3 border-l border-gray-200">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full"
                >
                  <Save className="mr-2" size={18} /> {mode == 'edit' ? 'Update' : 'Save'}
                </Button>
                <Button variant="outline" className="w-full border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                  Specific prices
                </Button>
                <Button variant="outline" className="w-full border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                  Credits / prepaid
                </Button>
                <Button variant="outline" className="w-full border-[1px] hover:bg-[#EDEEEF] hover:text-gray-800 rounded-t-md border-gray-300">
                  History stock entries
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CustomerForm
