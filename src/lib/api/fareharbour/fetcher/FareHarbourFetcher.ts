import { FareHarbourCompany } from "../models/FareHarbourCompany";
import { FareHarbourItemsResult } from "../models/FareHarbourItem";


export async function GetFareHarbourItemsForCompany (shortName: string) :  Promise<{
    isSuccessful: true;
    data: {
        company: FareHarbourCompany;
        items: FareHarbourItemsResult;
    }
} | {
    isSuccessful: false;
    errorMessage: string;
}>{

    //Get company
    try {
        const fareHarbourCompanyResponse = await fetch(`${process.env.FAREHARBOUR_BASE_URL}/v1/companies/${shortName}`, {
            method: "GET",
            headers: getHeaders()
        })

        if(!fareHarbourCompanyResponse.ok) {
            return {
                isSuccessful: false,
                errorMessage: `We were not able to get a company registered with FareHarbour with that short name`
            }
        }

        const fareHarbourCompanyJsonResult = await fareHarbourCompanyResponse.json() as FareHarbourCompany;

        //Make an item call
        const fareHarbourItemsResponse = await fetch(`${process.env.FAREHARBOUR_BASE_URL}/v1/companies/${shortName}/items?detailed=yes&require_future_availabilities=no`, {
            method: "GET",
            headers: getHeaders()
        })

        if(!fareHarbourItemsResponse.ok) {
            return {
                isSuccessful: false,
                errorMessage: `We were unable to get any items that your company is currently selling on FareHarbour`
            }
        }

        const fareHarbourJsonResult = await fareHarbourItemsResponse.json() as FareHarbourItemsResult;

        if(fareHarbourJsonResult.items.length === 0) {
            return {
                isSuccessful: false,
                errorMessage: `There are no items that your company currently sells on FareHarbour`
            }
        }

        return {
            isSuccessful: true,
            data: {
                company: fareHarbourCompanyJsonResult,
                items: fareHarbourJsonResult
            }
        }
        
    } catch (error : unknown) {
        if(typeof error === "string") {
            return {
                isSuccessful: false,
                errorMessage: error
            }
        } else if (error instanceof Error) {
            return {
                isSuccessful: false,
                errorMessage: error.message
            }
        }

        return {
            isSuccessful: false,
            errorMessage: `We were unable to get your items from FareHarbour. Try again in a bit`
        }


    }
    
}


function getHeaders() {
    return {
        'X-FareHarbor-API-App' : process.env.FAREHARBOUR_API_APP!,
        'X-FareHarbor-API-User': process.env.FAREHARBOUR_API_USER!
    }
}




