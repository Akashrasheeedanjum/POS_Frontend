import { createCity, createCountry } from "@/lib/actions/customers.actions"
import { toast } from "sonner"

export const cityCountryCreation = async(userData: any) =>{

    // const updatedUserData = { ...userData }
      // DEEP COPY here, not shallow
  const updatedUserData = JSON.parse(JSON.stringify(userData)); // or use structuredClone / lodash

    if(updatedUserData.country && typeof updatedUserData.country=== 'string'){
        try {
            updatedUserData.country  = await createCountry({countryName: updatedUserData.country})
        } catch (error) {
              console.error('Error while creating newly typed Country', error)
              toast.error(`${error}`)
        }
    }

    // for billingAddress.city

        if(updatedUserData.billingAddress?.city && typeof updatedUserData.billingAddress?.city === 'string'){

        try {
            updatedUserData.billingAddress.city = await createCity({cityName: updatedUserData?.billingAddress?.city, countryId:updatedUserData?.country?._id})
            
        } catch (error) {
        console.error('Error while creating new typed billingAddress city', error)
        toast.error(`${error}`)
        }
    }

     // for deliveryAddress.city
    if(updatedUserData.deliveryAddress?.city && typeof updatedUserData.deliveryAddress?.city === 'string' && updatedUserData.deliveryAddress.city.trim()){
        
        try {
            updatedUserData.deliveryAddress.city = await createCity({cityName: updatedUserData?.deliveryAddress?.city, countryId:updatedUserData?.country?._id})
            
        } catch (error) {
        console.error('Error while creating new typed deliveryAddress city', error)
        toast.error(`${error}`)
        }
    }

    return updatedUserData;

}