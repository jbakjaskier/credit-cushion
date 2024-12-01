

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RezdyProductProductSearchResult = {
    requestStatus: RequestStatus;
    products: RezdyProduct[];
};

type RezdyProduct = {
    productType: string;
    name: string;
    shortDescription: string;
    description: string;
    productCode: string;
    supplierId: string;
    supplierAlias: string;
    supplierName: string;
    timezone: string;
    priceOptions: RezdyPrice[];
    currency: string;
    images: RezdyImage[];
    latitude: number;
    longitude: number;
    locationAddress: RezdyLocationAddress;
}

type RezdyLocationAddress = {
    addressLine: string;
    postCode: string | undefined | null;
    city: string | undefined | null;
    state: string | undefined  | null;
    countryCode: string;
    latitude: number;
    longitude: number;
}

type RezdyImage = {
    id: number;
    itemUrl: string;
}

type RezdyPrice = {
    price: number;
    label: string;
    id: number;
    productCode: string;
}

type RequestStatus = {
    success: boolean;
    version: string;
}