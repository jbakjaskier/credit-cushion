import { RequestStatus, RezdyLocationAddress } from "./ProductSearchResult";


export type RezdyCompanyResult = {
    requestStatus: RequestStatus;
    companies : RezdyCompany[];
}

export type RezdyCompany = {
    alias?: string | null;
    companyName: string;
    firstName: string;
    lastName: string;
    address: RezdyLocationAddress;
    destinationName: string;
    destinationCountryCode: string;
    destinationPath: string;
    currency: string;
    locale: string;
    timezone: string;
    category: string;
    companyDescription: string;
    phone?: string | null;
    mobile?: string | null;
    website?: string | null;
}