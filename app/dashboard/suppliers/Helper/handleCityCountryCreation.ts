import { createCity } from "@/lib/actions/customers.actions"
import { toast } from "sonner"

export const supplierCityCountryCreation = async(userData: any) =>{


      // DEEP COPY here, not shallow
  const updatedUserData = JSON.parse(JSON.stringify(userData)); // or use structuredClone / lodash

    if(updatedUserData.city && typeof updatedUserData.city=== 'string'){
        try {
            updatedUserData.city  = await createCity({cityName: updatedUserData.city})
        } catch (error) {
            console.error('Error while creating newly typed city', error)
            toast.error(`${error}`)
        }
    }

    return updatedUserData;

}