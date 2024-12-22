"use server";

import { Loan, loanCollectionName } from "@/lib/db/models/loans";
import clientPromise, { dbName } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    return await handleRequest(request);
}

async function handleRequest(request: NextRequest) {
    try {
        const requestBody = await request.json() as EventPayload;
        //Update it to the database
        const mongoClient = await clientPromise;
        const loanCollection = mongoClient.db(dbName).collection<Loan>(loanCollectionName);

        // Check if it's an update for a hardship variation application that was sent to the customer
        const hardshipEnvelopeInDb = await loanCollection.findOne<Loan>({
            'hardship.envelopeDetails.envelopeId': requestBody.data.envelopeId
        })

        if(hardshipEnvelopeInDb !== null) {
            const currentDate = new Date()
            await loanCollection.updateOne({
                'hardship.envelopeDetails.envelopeId': requestBody.data.envelopeId
            }, {
                'hardship.envelopeDetails.envelopeStatus': requestBody.data.envelopeSummary.status,
                'hardship.envelopeDetails.lastUpdated': currentDate,
                'lastUpdated': currentDate
            })

            
            return NextResponse.json({
                isSuccessful: true
            }, {
                status: 201
            })
        }

        const loanInDb = await loanCollection.findOne<Loan>({
            envelopeId: requestBody.data.envelopeId
        });

        if(loanInDb === null) {
            //If it's null create it 
            await loanCollection.insertOne({
                ...getLoanFromEventPayload(requestBody),
                _id: new ObjectId()
            })
        } else {
            //Update the loanDb
            loanCollection.updateOne(
                {
                    envelopeId: requestBody.data.envelopeId
                },
                {
                    $set: getLoanFromEventPayload(requestBody)
                }
            )
        }


        return NextResponse.json({
            isSuccessful: true
        }, {
            status: 201
        })
        
    } catch (error: unknown) {
        if(typeof error === "string") {
            console.error("Unable to process the webhook",error);
        }

        if(error instanceof Error) {
            console.error("Unable to process the webhook. This error occured", error.name, error.message, error.cause, error.stack)
        }

        return NextResponse.json({
            error: `Unable to process the webhook request! Please try again in a bit`
        }, {
            status: 500
        })
    }
    
}

function getLoanFromEventPayload(payload: EventPayload) : Omit<Loan, "_id"> {
    
    const loanProviderSigner = getSigner("Loan Provider", payload.data.envelopeSummary.recipients?.signers);
    const customerSigner = getSigner("Customer", payload.data.envelopeSummary.recipients?.signers);


    switch(payload.event) {
        case "envelope-created": 
            return {
                createdDateTime: new Date(payload.data.envelopeSummary.createdDateTime!),
                envelopeId: payload.data.envelopeId,
                accountId: payload.data.accountId,
                envelopeUri: payload.data.envelopeSummary.envelopeUri,
                emailDetails: {
                    emailBlurb: payload.data.envelopeSummary.emailBlurb,
                    emailSubject: payload.data.envelopeSummary.emailSubject
                },
                status: "loan-created",
                representative: {
                    email: loanProviderSigner === undefined ? payload.data.envelopeSummary.sender.email : loanProviderSigner.email,
                    name: loanProviderSigner === undefined ? payload.data.envelopeSummary.sender.userName : loanProviderSigner.name
                },
                lastUpdated: new Date()
            }


        case "envelope-sent": 
            return {
                accountId: payload.data.accountId,
                sentDateTime: new Date(payload.data.envelopeSummary.sentDateTime!),
                createdDateTime: new Date(payload.data.envelopeSummary.createdDateTime!),
                envelopeId: payload.data.envelopeId,
                envelopeUri: payload.data.envelopeSummary.envelopeUri,
                emailDetails: {
                    emailBlurb: payload.data.envelopeSummary.emailBlurb,
                    emailSubject: payload.data.envelopeSummary.emailSubject
                },
                status: "loan-sent-to-customer",
                representative: {
                    email: loanProviderSigner === undefined ? payload.data.envelopeSummary.sender.email : loanProviderSigner.email,
                    name: loanProviderSigner === undefined ? payload.data.envelopeSummary.sender.userName : loanProviderSigner.name
                },
                customer: {
                    customerEmail: customerSigner!.email,
                    customerFullName: customerSigner!.name,
                    customerPhoneNumber: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Customer Phone Number")!.value,
                    customerDateOfBirth: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Customer Date of Birth")!.value,
                    customerAddress: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Customer Address")!.value
                },
                loanDetails: {
                    loanStartDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Loan Start Date")!.value,
                    loanEndDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Loan End Date")!.value,
                    repaymentStartDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Repayment Start Date")!.value,
                    repaymentEndDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Repayment End Date")!.value,
                    loanEstablishmentFees: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Loan Establishment Fees")!.value)
                    },
                    loanAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Loan Amount")!.value)
                    },
                    loanTotalRepaymentAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Loan Total Repayment Amount")!.value)
                    },
                    repaymentInstalmentAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Repayment Instalment Amount")!.value)
                    },
                    finalRepaymentInstalmentAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Final Repayment Instalment Amount")!.value)
                    }
                },
                lastUpdated: new Date()
            }


        case "envelope-completed": 
            return {
                accountId: payload.data.accountId,
                sentDateTime: new Date(payload.data.envelopeSummary.sentDateTime!),
                createdDateTime: new Date(payload.data.envelopeSummary.createdDateTime!),
                completedDateTime: new Date(payload.data.envelopeSummary.completedDateTime!),
                envelopeId: payload.data.envelopeId,
                envelopeUri: payload.data.envelopeSummary.envelopeUri,
                emailDetails: {
                    emailBlurb: payload.data.envelopeSummary.emailBlurb,
                    emailSubject: payload.data.envelopeSummary.emailSubject
                },
                status: "loan-signed-by-customer",
                representative: {
                    email: loanProviderSigner === undefined ? payload.data.envelopeSummary.sender.email : loanProviderSigner.email,
                    name: loanProviderSigner === undefined ? payload.data.envelopeSummary.sender.userName : loanProviderSigner.name
                },
                customer: {
                    customerEmail: customerSigner!.email,
                    customerFullName: customerSigner!.name,
                    customerPhoneNumber: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Customer Phone Number")!.value,
                    customerDateOfBirth: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Customer Date of Birth")!.value,
                    customerAddress: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Customer Address")!.value
                },
                loanDetails: {
                    loanStartDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Loan Start Date")!.value,
                    loanEndDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Loan End Date")!.value,
                    repaymentStartDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Repayment Start Date")!.value,
                    repaymentEndDate: loanProviderSigner!.tabs!.textTabs!.find(x => x.tabLabel === "Repayment End Date")!.value,
                    loanEstablishmentFees: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Loan Establishment Fees")!.value)
                    },
                    loanAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Loan Amount")!.value)
                    },
                    loanTotalRepaymentAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Loan Total Repayment Amount")!.value)
                    },
                    repaymentInstalmentAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Repayment Instalment Amount")!.value)
                    },
                    finalRepaymentInstalmentAmount: {
                        currency: "aud",
                        value: parseFloat(loanProviderSigner!.tabs!.numberTabs!.find(x => x.tabLabel === "Final Repayment Instalment Amount")!.value)
                    }
                },
                customerDateSigned: new Date(customerSigner!.tabs!.dateSignedTabs!.find(x => x.tabLabel === "Customer Date Signed")!.value),
                lastUpdated: new Date()
            }
    }
}

function getSigner(roleName: RoleName, signers?: EnvelopeSigner[]) : EnvelopeSigner | undefined {
    const signer = signers?.find(ite => ite.roleName === roleName);
    return signer;
}

type RoleName = "Loan Provider" | "Customer"
type WebhookEvent = "envelope-sent" | "envelope-completed" | "envelope-created"

type EventPayload = {
    event: WebhookEvent;
    uri: string;
    retryCount: string;
    configurationId: string;
    apiVersion: string;
    generatedDateTime: string;
    data: EventData;
}


type EventData = {
    accountId: string;
    envelopeId: string;
    userId: string;
    envelopeSummary: EnvelopeSummary;
}

type EnvelopeSummary = {
    status: string;
    envelopeUri: string;
    emailBlurb: string;
    emailSubject: string;
    sentDateTime?: string;
    completedDateTime?: string;
    createdDateTime?: string;
    sender: EnvelopeSender;
    recipients?: {
        signers?: EnvelopeSigner[]; 
    }
}

type EnvelopeSigner = {
    roleName: RoleName;
    email: string;
    name: string;
    recipientId: string;
    recipientGuid: string;
    tabs?: {
        fullNameTabs?: FullNameTab[];
        textTabs?: TextTab[];
        numberTabs?: TextTab[]; //Currently all number tabs sent in template request are being treated as textTabs - numberTabs over the API call will be supported in the future
        dateSignedTabs?: DateSignedTab[];
        emailAddressTabs?: EmailAddressTab[];
    }
}


type EnvelopeSender = {
    userName: string;
    userId: string;
    accountId: string;
    email: string;
    ipAddress: string;
}

type FullNameTab = {
    name: string;
    tabLabel: "Customer Name";
    value: string;
}

type DateSignedTab = {
    tabLabel: "Customer Date Signed"
    name: string;
    value: string;
}

type EmailAddressTab = {
    tabLabel: "Customer Email";
    name: string;
    value: string;
}

type TextTab = {
    name: string;
    tabLabel:  "Customer Date of Birth" | "Customer Phone Number" | "Loan Start Date" | "Loan End Date" | "Repayment Start Date" | "Repayment End Date" | "Customer Address" | "Loan Establishment Fees"  | "Loan Amount" | "Loan Total Repayment Amount" | "Repayment Instalment Amount" | "Final Repayment Instalment Amount";
    value: string;
}
