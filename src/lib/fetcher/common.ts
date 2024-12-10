import { EnvelopeTemplate } from "./template";

export type FetcherError = {
    errorMessage: string;
}

export function isFetcherError(input: FetcherError | EnvelopeTemplate[]): input is FetcherError {
    return (input as FetcherError).errorMessage !== undefined && (input as FetcherError).errorMessage !== null;
}