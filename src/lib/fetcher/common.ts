import { EnvelopeSentResult } from "./envelope";
import { EnvelopeTemplate } from "./template";

export type FetcherError = {
    errorMessage: string;
}

export function isFetcherError(input: FetcherError | EnvelopeTemplate[] | EnvelopeSentResult): input is FetcherError {
    return (input as FetcherError).errorMessage !== undefined && (input as FetcherError).errorMessage !== null;
}