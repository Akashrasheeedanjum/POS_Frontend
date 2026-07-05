"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {   Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {Bank, getprofiles, updateUserprofile, UserProfile} from "@/lib/actions/profile.actions"
import { toast } from "sonner"
import { createNewBank, deleteBank } from "@/lib/actions/banks.actions"
import {ClipLoader} from "react-spinners"
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal"
// Define the bank account type
type BankAccount = {
  _id: string
  bankName: string
  bankNumber: string
}

export default function UserRegistration() {
    const [bankAccounts, setBankAccounts] = useState<Bank[]>([])
    const [newBankName, setNewBankName] = useState("")
    const [newAccountNumber, setNewAccountNumber] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [addingBank, setAddingBank] = useState(false)
    const [enterpriseProfile, setEnterpriseProfile] = useState<UserProfile | null>(null)
    const [updatedProfile, setUpdatedProfile] = useState<Partial<UserProfile>>({})
    const [hasChanges, setHasChanges] = useState(false)

    const [bankToDelete, setBankToDelete] = useState<BankAccount|null>()
    const [openBankDeleteModal, setOpenBankDeleteModal] = useState(false)
    const [isBankDeleting, setIsBankDeleting] = useState(false)


      useEffect(() => {
        const fetchEnterpriseUser = async () => {
          try {
            setIsLoading(true)
            const params = await getprofiles()
            setEnterpriseProfile(params[0])
            setBankAccounts(params[0]?.banks)
          } catch (error) {
            console.error("Error fetching Enterprise Profile:", error)
            toast.error("Failed to fetch Enterprise Profile")
          } finally {
            setIsLoading(false)
          }
        }
    
        fetchEnterpriseUser()
      }, [])

    const handleAddBankAccount = async() => {
        if (newBankName && newAccountNumber) {
        try {
        setAddingBank(true)
        const newBank = await createNewBank({bankName:newBankName.trim(), bankNumber:newAccountNumber.trim()})
        await updateUserprofile(enterpriseProfile?._id, {banks: [newBank?._id]})  //after creating newBank pass that bank id to current user's Profile
        const {__v, createdAt, updatedAt, ...bank} = newBank
        setBankAccounts([...bankAccounts, bank])
        setNewBankName("")
        setNewAccountNumber("")
        setAddingBank(false)
        setIsDialogOpen(false)
        toast.success("New Bank account created Successfully")
        } catch (error) {
            setAddingBank(false)
            console.error('Error while craeting new Bank account!', error)
            toast.error("Could not create new Bank account!")
        }
        }
      }

      const handleDeleteBankRequest = (bank:any) => {
        setBankToDelete(bank)
        setOpenBankDeleteModal(true)
      }
    
    //   const handleDeleteBankAccount = async(id: string) => {
      const handleDeleteBankAccount = async() => {
        const id = bankToDelete?._id
        setIsBankDeleting(true)
        try {
            // setDeletingBankId(bankToDelete?._id)
            await deleteBank(id)
            await updateUserprofile(enterpriseProfile?._id, {banks: [id]})   //deAttaching bak id from userprofile 
            setBankAccounts(bankAccounts.filter((account) => account._id !== id))
            toast.success("Bank account deleted successfully")
            // setDeletingBankId(null)
        } catch (error) {
            // setDeletingBankId(null)
            console.error('Error while deleting bank account', error)
            toast.error("Could not delete account!")
        }finally{
            setOpenBankDeleteModal(false)
            setBankToDelete(null)
            setIsBankDeleting(false)
        }
      }

        const handleUpdateFinancialParams = (changedParams: Partial<UserProfile>) => {
          if (!enterpriseProfile) return
      
          setUpdatedProfile((prev) => ({
            ...prev,
            ...changedParams,
          }))
          console.log('changedParams', changedParams)
          setHasChanges(true)
        }

      const handleChange = (field: string, value: string | number | boolean) => {
        console.log('field => ', field, 'value => ', value)
        handleUpdateFinancialParams({ [field]: value })
      }


      const saveChanges = async() =>{
          const updatedValues = Object.values(updatedProfile).some(value => value !== undefined && value !== null && value !== '');
          
          if(updatedProfile?.name?.trim() == '') {
              toast.error('Name field cannot be empty')
              return
            }
            if(!enterpriseProfile || !updatedValues) return
        try {
            setUpdatingProfile(true)
        const newParams = { ...enterpriseProfile, ...updatedProfile }
        const {_id ,banks, __v, optionalParameters, ...updatedData} = newParams
        const trimmedData = Object.fromEntries(
            Object.entries(updatedData).map(([key, value]) => [
              key,
              typeof value === 'string' ? value.trim() : value,
            ])
          );
        const response = await updateUserprofile(_id, trimmedData)

        // setEnterpriseProfile(newParams)
        setEnterpriseProfile(response)
        setUpdatingProfile(false)
        setUpdatedProfile({})
        setHasChanges(false)
        toast.success("Enterprise profile updated successfully!")
        } catch (error) {
        setUpdatingProfile(false)
        console.error("Could not update profile:", error)
        toast.error("Could not update profile")
        }

        
      }
    return (
        <div className="w-full max-w-full mx-auto p-6  ">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Entreprise</h2>
                <div className="h-0.5 w-full bg-gray-200 mt-2"></div>
            </div>

            <form className="space-y-6 max-w-4xl mx-auto border border-gray-200 rounded-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Row 1 */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium dark:text-gray-200">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={updatedProfile.name ?? enterpriseProfile?.name ?? ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="font-medium dark:text-gray-200">
                            Adresse
                        </Label>
                        <Input
                            id="address"
                            // defaultValue="Rue du centre, 1"
                            value={updatedProfile.address ?? enterpriseProfile?.address ?? ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="space-y-2">
                        <Label htmlFor="city" className="font-medium dark:text-gray-200">
                            City
                        </Label>
                        <Input
                            id="city"
                            // defaultValue="BRUXELLES"
                            value={updatedProfile.city ?? enterpriseProfile?.city ?? ''}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="zipcode" className="font-medium dark:text-gray-200">
                            Zip code
                        </Label>
                        <Input
                            id="zipcode"
                            // defaultValue="1000"
                            value={updatedProfile.zipCode ?? enterpriseProfile?.zipCode ?? ''}
                            onChange={(e) => handleChange('zipCode', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-2">
                        <Label htmlFor="tel" className="font-medium dark:text-gray-200">
                            Tel
                        </Label>
                        <Input
                            id="tel"
                            // defaultValue="02 404040404"
                            value={updatedProfile.tel ?? enterpriseProfile?.tel ?? ''}
                            onChange={(e) => handleChange('tel', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fax" className="font-medium dark:text-gray-200">
                            Fax
                        </Label>
                        <Input
                            id="fax"
                            // defaultValue="04 202020202"
                            value={updatedProfile.fax ?? enterpriseProfile?.fax ?? ''}
                            onChange={(e) => handleChange('fax', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Row 4 */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium dark:text-gray-200">
                            E-Mail
                        </Label>
                        <Input
                            id="email"
                            // type="email"
                            // defaultValue="info@data-concept.be"
                            value={updatedProfile.email ?? enterpriseProfile?.email ?? ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vat" className="font-medium dark:text-gray-200">
                            <span className="block">Indication mandatory</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                (N° VAT or SIREN / RCS / APE)
                            </span>
                        </Label>
                        <Input
                            id="indicatonMandatory"
                            // defaultValue="FR0111222333"
                            value={updatedProfile.indicatonMandatory ?? enterpriseProfile?.indicatonMandatory ?? ''}
                            onChange={(e) => handleChange('indicatonMandatory', e.target.value)}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

        <DeleteConfirmationModal 
        open={openBankDeleteModal}
        onClose={() => setOpenBankDeleteModal(false)}
        onConfirm={handleDeleteBankAccount}
        message={`Do you want to delete Bank Name: ${bankToDelete?.bankName}, Account Number: ${bankToDelete?.bankNumber}?`}
        loadingState={isBankDeleting}
        />
                    {/* Row 5 - Bank section */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="bank" className="font-medium dark:text-gray-200">
                                Bank
                            </Label>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-fit flex items-center gap-2">
                                        <Plus size={16} /> Add Bank Account
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white">
                                    <DialogHeader>
                                        <DialogTitle className="dark:text-white">Add Bank Account</DialogTitle>
                                        <DialogDescription className="dark:text-gray-400">
                                            Enter the bank details below to add a new bank account.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bankName" className="dark:text-gray-200">
                                                Bank Name
                                            </Label>
                                            <Input
                                                id="bankName"
                                                value={newBankName}
                                                onChange={(e) => setNewBankName(e.target.value)}
                                                placeholder="e.g. Banque AXA"
                                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="accountNumber" className="dark:text-gray-200">
                                                Account Number (IBAN)
                                            </Label>
                                            <Input
                                                id="accountNumber"
                                                value={newAccountNumber}
                                                onChange={(e) => setNewAccountNumber(e.target.value)}
                                                placeholder="e.g. BE72 7777 4444 3333"
                                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                        className={addingBank? "opacity-40 cursor-not-allowed": ""} 
                                        disabled={addingBank}
                                        onClick={handleAddBankAccount}>{addingBank ? 'Creating...': 'Add Account'}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Bank accounts list */}
                        {bankAccounts.length > 0 && (
                            <div className="mt-4 space-y-3">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Bank Accounts</h3>
                                <div className="space-y-2">
                                    {bankAccounts.map((account) => (
                                        <div
                                            key={account._id}
                                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md"
                                        >
                                            <div>
                                                <p className="font-medium dark:text-white">{account.bankName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{account.bankNumber}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                // onClick={() => handleDeleteBankAccount(account._id)}
                                                onClick={() => handleDeleteBankRequest(account)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Default bank field for backward compatibility */}
                        {!isLoading && !bankAccounts.length && (
                            // <Input
                            //     id="bank"
                            //     defaultValue="Banque AXA - IBAN : BE72 7777 4444 3333"
                            //     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            // />
                            <div className="flex justify-center items-center bg-gray-100 h-20 rounded-md">
                                <p className="text-red-500">No bank found! Please add one</p>
                            </div>
                        )}
                    </div>

                </div>
                <div className="h-0.5 w-full bg-gray-200 mt-6"></div>

                <div className="flex justify-end pt-4 pb-4">
                    <Button 
                    disabled={!hasChanges || updatingProfile}
                    onClick={saveChanges}
                    type="button" 
                    className={`${hasChanges ? 'opacity-100': 'opacity-40'} px-8 py-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90`}>
                        {updatingProfile? 'Submitting': 'Submit'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

