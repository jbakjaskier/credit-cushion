"use server"

import {z} from "zod"

import { HardshipFormErrorDetail, HardshipFormState } from "@/components/hardship/HardshipForm";


function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function createCustomerHardship(prevState : HardshipFormState, formData: FormData) : Promise<HardshipFormState> {

    const zodValidator = z.object({
        fullLegalName: z.string().trim().min(1, {message: "The Full Legal Name should be a valid value"}),
        emailAddress: z.string().email({message: `Please enter a valid email Address`}),
        phoneNumber: z.string().trim()
            .min(6, {message: "Please enter a valid mobile phone number"})
            .startsWith("+", {message: "Please add an international code to your phone number. Example: +61"})
            .refine((val) => !/\s/.test(val), {message: `Please enter a valid phone number without any spaces and with the international code. Example: +61336597654`}),
        circumstanceReason: z.string().trim().min(1, {message: "Please select how your circumstance has changed"}),
        circumstanceExplanation: z.string().trim().min(10, {message: "Please explain how your circumstance has changed"}),
        idealArrangement: z.string().trim().min(10, {message: "Explain in more detail what your ideal arrangement would look like"}),
        supportingDocument: z.custom<File>((val) => {
            if(val instanceof File && val.type === "application/pdf" && val.size <= 10 * 1024 * 1024) {
                return true
            }
            return false;
        }, {
            message: "Please attach supporting documents that support your case"
        })
    })

    const result = await zodValidator.safeParseAsync({
        fullLegalName: formData.get('fullLegalName'),
        emailAddress: formData.get('customerEmail'),
        phoneNumber: formData.get('phoneNumber'),
        circumstanceReason: formData.get('circumstanceReason'),
        circumstanceExplanation: formData.get('circumstanceExplanation'),
        idealArrangement: formData.get('idealArrangement'),
        supportingDocument: formData.get('supporting-documents')
    })


    if(!result.success) {
        let errorObject: HardshipFormErrorDetail = {};

        result.error.errors.forEach(res => {
            const propName = (res.path as string[])[0];
            switch(propName) {
                case "fullLegalName": 
                    errorObject.fullLegalName = res.message;
                    break;
                case "emailAddress": 
                    errorObject.emailAddress = res.message;
                    break;
                case "phoneNumber": 
                    errorObject.phoneNumber = res.message;
                    break;
                case "circumstanceReason": 
                    errorObject.circumstanceReason = res.message;
                    break;
                case "circumstanceExplanation": 
                    errorObject.circumstanceExplanation = res.message;
                    break;
                case "idealArrangement": 
                    errorObject.idealArrangement = res.message;
                    break;
                case "supportingDocument": 
                    errorObject.supportingDocument = res.message;
                    break;
                default: 
                    console.info(`Skipping error message for ${res.path}`)
            }
            
        });
        

        return {
            mode: "error",
            errorDetails: errorObject!
        }
    }


    
    return {
        mode: "success",
    }
}