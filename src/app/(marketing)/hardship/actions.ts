"use server"

import { HardshipFormState } from "@/components/hardship/HardshipForm";


export async function createCustomerHardship(prevState : HardshipFormState, formData: FormData) : Promise<HardshipFormState> {

    const fullLegalName = formData.get('fullLegalName') as string;
    const emailAddress = formData.get('customerEmail') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const circumstanceReason = formData.get('circumstanceReason') as string;
    const circumstanceExplanation = formData.get('circumstanceExplanation') as string;
    const idealArrangement = formData.get('idealArrangement') as string;
    const supportingDocument = formData.get('supporting-documents') as File;
    
    

    console.info('supportingDocument', supportingDocument)
    console.info('circumstanceReason', circumstanceReason);

    console.info('formData', formData)

    return {
        mode: "initial"
    }


    const dataFromForm = {
        fullLegalName: ``
    };

}