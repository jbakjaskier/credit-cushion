import { RequestStatus, RezdyLocationAddress } from "./ProductSearchResult";


export type RezdyCompanyResult = {
    requestStatus: RequestStatus;
    companies : RezdyCompany[];
}

export type RezdyCompany = {
    alias?: string | null;
    companyName: string;
    firstName: string;
    lastName: String;
    address: RezdyLocationAddress;
    destinationName: string;
    destinationCountryCode: string;
    destinationPath: String;
    currency: string;
    locale: string;
    timezone: String;
    category: string;
    companyDescription: string;
    phone?: string | null;
    mobile?: string | null;
    website?: string | null;
}