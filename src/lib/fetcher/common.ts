import { EnvelopeCreatedResult } from "./envelope";
import { EnvelopeTemplateResult } from "./template";

export type FetcherError = {
    errorMessage: string;
}

export function isFetcherError(input: FetcherError | EnvelopeTemplateResult | EnvelopeCreatedResult): input is FetcherError {
    return (input as FetcherError).errorMessage !== undefined && (input as FetcherError).errorMessage !== null;
}