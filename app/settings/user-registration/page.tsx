"use client"
import React, { useEffect, useState } from 'react'
import UserRegistration from './_components/user-registration'
import RepairOrder from './_components/repair-order'
import SettingsInterface from './_components/settings-interface'
import { Button } from '@/components/ui/button'
import { getprofiles, OptionalParameters, updateUserprofile, UserProfile } from '@/lib/actions/profile.actions'
import { toast } from "sonner"
import {HashLoader} from "react-spinners"
 const Page = () => {

  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [enterpriseProfile, setEnterpriseProfile] = useState<UserProfile | null>(null)
  const [updatedParams, setUpdatedParams] = useState<Partial<OptionalParameters>>({})

  useEffect(() => {
    const fetchEnterpriseProfile = async () => {
      try {
        setIsLoading(true)
        const params = await getprofiles()
        
        setEnterpriseProfile(params[0])
      } catch (error) {
        console.error("Error fetching Profile settings:", error)
        toast.error("Failed to fetch Profile settings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnterpriseProfile()
  }, [])

    const handleUpdateFinancialParams = (changedParams: Partial<OptionalParameters>) => {
      if (!enterpriseProfile) return
  
      setUpdatedParams((prev) => ({
        ...prev,
        ...changedParams,
      }))
      setHasChanges(true)
    }

    const saveAllChanges = async () => {
    if (!enterpriseProfile || !hasChanges) return

    try {
      setIsLoading(true)

      // First merge updatedParams into enterpriseProfile.optionalParameters
    const mergedOptionalParameters = {
      ...enterpriseProfile.optionalParameters,
      ...updatedParams,
    };

    if(mergedOptionalParameters.endOrderMessage){
      mergedOptionalParameters.endOrderMessage = mergedOptionalParameters.endOrderMessage.trim() 
    }
      // Then create newParams with merged optionalParameters, excluding _id from inside optionalParameters
      const { _id, ...optionalParametersWithoutId } = mergedOptionalParameters;
      const response = await updateUserprofile(enterpriseProfile?._id, {optionalParameters:optionalParametersWithoutId})

      setEnterpriseProfile(response)
      setHasChanges(false)
      setUpdatedParams({})
      toast.success("Profile settings updated successfully")
    } catch (error) {
      console.error("Error updating Profile settings:", error)
      toast.error("Failed to update Profile settings")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
    <HashLoader color="#E4D8D2" size={60}/>
    </div>
  }

  if (!enterpriseProfile) {
    return <div className="flex justify-center items-center h-full">
      <div className="text-center text-red-500">
      No Enterprise Profile Data found.
      </div>
      </div>
  }


   return (
     <div className='max-h-[100vh] overflow-auto '>
      <UserRegistration />
      <RepairOrder 
      manageRepairs={updatedParams.manageRepairs ?? enterpriseProfile?.optionalParameters?.manageRepairs}
      vatCodeApplied={updatedParams.vatCodeApplied ?? enterpriseProfile?.optionalParameters?.vatCodeApplied}
      endOrderMessage={updatedParams.endOrderMessage ?? enterpriseProfile?.optionalParameters?.endOrderMessage ?? ''}
      onRepairOrderUpdate={(repairOrder) => handleUpdateFinancialParams({ ...repairOrder })}
      />

      <SettingsInterface
        checkUpdateAtStartup={updatedParams.checkUpdateAtStartup ?? enterpriseProfile?.optionalParameters?.checkUpdateAtStartup ?? false}
        touchKeyboardEnabledByDefault={updatedParams.touchKeyboardEnabledByDefault ?? enterpriseProfile?.optionalParameters?.touchKeyboardEnabledByDefault ?? false}
        roundCashPaymentsTo5Cents={updatedParams.roundCashPaymentsTo5Cents ?? enterpriseProfile?.optionalParameters?.roundCashPaymentsTo5Cents ?? false}
        backupAtClosing={updatedParams.backupAtClosing ?? enterpriseProfile?.optionalParameters?.backupAtClosing ?? false}
        identificationBeforeEachSale={updatedParams.identificationBeforeEachSale ?? enterpriseProfile?.optionalParameters?.identificationBeforeEachSale ?? false}
        managementPanels={updatedParams.managementPanels ?? enterpriseProfile?.optionalParameters?.managementPanels ?? false}
        keyboardInCapitalActivated={updatedParams.keyboardInCapitalActivated ?? enterpriseProfile?.optionalParameters?.keyboardInCapitalActivated ?? false}
        proposeLastDocumentTypeUsed={updatedParams.proposeLastDocumentTypeUsed ?? enterpriseProfile?.optionalParameters?.proposeLastDocumentTypeUsed ?? false}
        checkStockAtSale={updatedParams.checkStockAtSale ?? enterpriseProfile?.optionalParameters?.checkStockAtSale ?? false}
        // endOrderMessage={updatedParams.endOrderMessage ?? enterpriseProfile?.optionalParameters?.endOrderMessage ?? ''}
        includeSalesInInboundHistory={updatedParams.includeSalesInInboundHistory ?? enterpriseProfile?.optionalParameters?.includeSalesInInboundHistory ?? false}
        includeSalesByClientInClosure={updatedParams.includeSalesByClientInClosure ?? enterpriseProfile?.optionalParameters?.includeSalesByClientInClosure ?? false}
        simplifiedFinancialReport={updatedParams.simplifiedFinancialReport ?? enterpriseProfile?.optionalParameters?.simplifiedFinancialReport ?? false}
        multiStoreVersionKeepLocalHistory={updatedParams.multiStoreVersionKeepLocalHistory ?? enterpriseProfile?.optionalParameters?.multiStoreVersionKeepLocalHistory ?? false}
        deleteDataLocallyAfterSentToServer={updatedParams.deleteDataLocallyAfterSentToServer ?? enterpriseProfile?.optionalParameters?.deleteDataLocallyAfterSentToServer ?? false}
        onSettingUpdate={(setting) => handleUpdateFinancialParams({ ...setting })}
      />
      
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button onClick={saveAllChanges} disabled={isLoading} className="shadow-lg" size="lg">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
     </div>
   )
 }
 
 export default Page