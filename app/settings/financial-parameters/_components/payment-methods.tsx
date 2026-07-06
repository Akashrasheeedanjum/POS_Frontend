"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createPaymentMethod, deletePaymentMethod, getAllPaymentMethods } from "@/lib/actions/paymentMethods.actions"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal"
import { useSession } from "@clerk/nextjs"

interface PaymentMethod {
  _id: string
  name: string
  isActive: boolean
  __v?: number
}

interface PaymentMethodsProps {
  paymentMethodIds: PaymentMethod[] 
  allowSaleOnCredit: boolean
  onPaymentMethodsUpdate: (paymentMethods: string[]) => void
  onSaleOnCreditChange: (allowSaleOnCredit: boolean) => void
}

export default function PaymentMethods({
  paymentMethodIds,
  allowSaleOnCredit,
  onPaymentMethodsUpdate,
  onSaleOnCreditChange
}: PaymentMethodsProps) {
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddNewDialogOpen, setIsAddNewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>()
  const [isMethodCreating, setIsMethodCreating] = useState(false)

  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod|null>()
  const [openMethodDeleteModal, setOpenMethodDeleteModal] = useState(false)
  const [isMethodDeleting, setIsMethodDeleting] = useState(false)

  const { session } = useSession();
  const token:any = session?.user?.publicMetadata?.token

  const fetchPaymentMethods = async () => {
    setIsLoading(true)
    try {
      const paymentMethodsData = await getAllPaymentMethods(token)
      setAvailablePaymentMethods(paymentMethodsData)
      // Filter to only show selected payment methods
      const selectedMethods = paymentMethodsData?.filter((pm: PaymentMethod) => 
        paymentMethodIds.some((selectedPm) => selectedPm._id === pm._id)
      )
      // setPaymentMethods(selectedMethods)
      setPaymentMethods(paymentMethodsData)
    } catch (error) {
      console.error("Failed to fetch payment methods:", error)
      toast.error("Failed to load payment methods")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [paymentMethodIds])

  const handleAddPaymentMethod = (methodId: string) => {
    const methodToAdd = availablePaymentMethods?.find(pm => pm._id === methodId)
    if (!methodToAdd) return

    const newPaymentMethods:any = [...paymentMethods, methodToAdd]
    setPaymentMethods(newPaymentMethods)
    // onPaymentMethodsUpdate(newPaymentMethods.map(pm => pm._id))
    onPaymentMethodsUpdate(newPaymentMethods)
    
    setIsComboboxOpen(false)
  }

  const handleDeleteMethodRequest = (method:any) => {
        setMethodToDelete(method)
        setOpenMethodDeleteModal(true)
  }
  // const handleDeletePaymentMethod = async(methodId: string) => {
  const handleDeletePaymentMethod = async() => {
    const methodId = methodToDelete?._id
    setIsMethodDeleting(true)
    try {
    const newPaymentMethods:any = paymentMethods.filter(pm => pm._id !== methodId)
    if(newPaymentMethods.length === 0) {
      toast.error("You must have at least one payment method")
      return
    }
    await deletePaymentMethod(methodId);
    setPaymentMethods(newPaymentMethods)
    toast.success("Payment Method Deleted Successfully")
    } catch (error) {
    console.error('Error while deleting PaymentMethod', error)
    toast.error(`${error}`)
    }finally{
    setOpenMethodDeleteModal(false)
    setMethodToDelete(null)
    setIsMethodDeleting(false)
    }

    // onPaymentMethodsUpdate(newPaymentMethods)
  }


  const handleCreatePaymentMethod = async() => {
    setIsMethodCreating(true)
    try {
      const newMethod = {name: newPaymentMethod, isActive:true}
      const created = await createPaymentMethod(newMethod)
      const newPaymentMethodsList:any = [...paymentMethods, created]
      setPaymentMethods(newPaymentMethodsList)
      // onPaymentMethodsUpdate(newPaymentMethodsList)
      setNewPaymentMethod('')
      toast.success(`Payment method created successfully`)
    } catch (error) {
      toast.error(`${error}`)
    }finally{
      setIsAddNewDialogOpen(false)
      setIsMethodCreating(false)
    }
  }
  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Payment Methods</CardTitle>
          </div>
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Add Method</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Select a payment method from the list below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isComboboxOpen}
                      className="w-full justify-between"
                    >
                      {isLoading ? "Loading..." : "Select payment method"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search payment methods..." />
                      <CommandList>
                        <CommandEmpty>No payment method found.</CommandEmpty>
                        <CommandGroup>
                          {availablePaymentMethods
                            .filter(method => !paymentMethods.some(pm => pm._id === method._id))
                            .map(method => (
                              <CommandItem
                                key={method._id}
                                value={method._id}
                                onSelect={() => handleAddPaymentMethod(method._id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    paymentMethods.some(pm => pm._id === method._id) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {method.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
          <Dialog open={isAddNewDialogOpen} onOpenChange={setIsAddNewDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <span>Add Method</span>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Payment Method</DialogTitle>
                <DialogDescription>Enter details for new payment method</DialogDescription>
              </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-4">
                <Label htmlFor="methodName" className="col-span-1 text-start">
                  Method Name
                </Label>
                <Input
                  id="name"
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
              className={isMethodCreating? "opacity-40 cursor-not-allowed": ""} 
              disabled={isMethodCreating}
              onClick={handleCreatePaymentMethod}>{isMethodCreating? 'Creating...': 'Create'}</Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-64 overflow-auto">
          {/* proposed dropdown */}
            {/* <div className='w-full'>
  <Select 
  // value={searchFilterField} 
  // onValueChange={(value) => setSearchFilterField(value)}
  >
    <SelectTrigger className='px-4 rounded-none outline-none' id="searchFilter">
      <SelectValue className="outline-none" placeholder="Select Field" />
    </SelectTrigger>
    <SelectContent className='h-[4rem]'>
      <SelectItem value="">Select Field</SelectItem>
      {availablePaymentMethods
      .filter(method => !paymentMethods.some(pm => pm._id === method._id))
      .map(method => (
        <SelectItem key={method._id} 
        value={method.name}>{method.name}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  </div> */}
  {/* proposed modal to select method*/}
           {/* <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Select A Method</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Select a payment method from the list below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isComboboxOpen}
                      className="w-full justify-between"
                    >
                      {isLoading ? "Loading..." : "Select payment method"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search payment methods..." />
                      <CommandList>
                        <CommandEmpty>No payment method found.</CommandEmpty>
                        <CommandGroup>
                          {availablePaymentMethods
                            .filter(method => !paymentMethods.some(pm => pm._id === method._id))
                            .map(method => (
                              <CommandItem
                                key={method._id}
                                value={method._id}
                                onSelect={() => handleAddPaymentMethod(method._id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    paymentMethods.some(pm => pm._id === method._id) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {method.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div> */}

          {isLoading ? (
            <div className="p-6 text-center">Loading payment methods...</div>
          ) : paymentMethods.length > 0 ? (
            <ul className="divide-y">
              {paymentMethods.map(method => (
                <li key={method._id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <span className="font-medium">{method.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => handleDeletePaymentMethod(method._id)}
                    onClick={() => handleDeleteMethodRequest(method)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}

              <DeleteConfirmationModal 
              open={openMethodDeleteModal}
              onClose={() => setOpenMethodDeleteModal(false)}
              onConfirm={handleDeletePaymentMethod}
              message={`Do you want to delete Payment Method: ${methodToDelete?.name}?`}
              loadingState={isMethodDeleting}
              />
            </ul>
          ) : (
            <div className="p-6 text-center">No payment methods added yet</div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="sale-credit" className="font-medium">
              Allow sale on credit
            </Label>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${!allowSaleOnCredit ? "font-medium" : "text-muted-foreground"}`}>off</span>
              <Switch
                id="sale-credit"
                checked={allowSaleOnCredit}
                onCheckedChange={onSaleOnCreditChange}
              />
              <span className={`text-xs ${allowSaleOnCredit ? "font-medium" : "text-muted-foreground"}`}>on</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}