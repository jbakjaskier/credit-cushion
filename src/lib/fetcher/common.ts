import { EnvelopeCreatedResult } from "./envelope";
import { EnvelopeTemplate } from "./template";

export type FetcherError = {
    errorMessage: string;
}

export function isFetcherError(input: FetcherError | EnvelopeTemplate[] | EnvelopeCreatedResult): input is FetcherError {
    return (input as FetcherError).errorMessage !== undefined && (input as FetcherError).errorMessage !== null;
}