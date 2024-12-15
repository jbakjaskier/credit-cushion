"use server";

import { Loan, loanCollectionName } from "@/lib/db/models/loans";
import clientPromise, { dbName } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    return await handleRequest(request);
}

export async function POST(request: NextRequest) {
    return await handleRequest(request);
}

const unauthorizedMessage = `This is an unauthorized request`;


async function handleRequest(request: NextRequest) {
    const authorizationHeaderValue = request.headers.get("Authorization");
    if(authorizationHeaderValue === null || !authorizationHeaderValue.startsWith("Basic")) {
        return NextResponse.json(
            {
                error: unauthorizedMessage
            },
            {
                status: 401
            }
        )
    }

    const base64Credentials = authorizationHeaderValue.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [userName, password] = credentials.split(':');

    if(userName !== process.env.DOCUSIGN_WEBHOOK_USERNAME || password !== process.env.DOCUSIGN_WEBHOOK_PASSWORD) {
        return NextResponse.json({
            error: unauthorizedMessage
        }, {
            status: 401
        })
    }

    console.info(`The Webhook Request has been successfully authenticated`);

    try {
        const requestBody = await request.json() as EventPayload;
        //Update it to the database
        const mongoClient = await clientPromise;
        const loanCollection = mongoClient.db(dbName).collection<Loan>(loanCollectionName);

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
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                sentDateTime: new Date(payload.data.envelopeSummary.sentDateTime!),
                createdDateTime: new Date(payload.data.envelopeSummary.createdDateTime!),
                envelopeId: payload.data.envelopeId,
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
                    customerEmail: loanProviderSigner!.tabs!.emailAddressTabs![0].value,
                    customerFullName: loanProviderSigner!.tabs!.fullNameTabs![0].value,
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
                sentDateTime: new Date(payload.data.envelopeSummary.sentDateTime!),
                createdDateTime: new Date(payload.data.envelopeSummary.createdDateTime!),
                completedDateTime: new Date(payload.data.envelopeSummary.completedDateTime!),
                envelopeId: payload.data.envelopeId,
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
                    customerEmail: loanProviderSigner!.tabs!.emailAddressTabs![0].value,
                    customerFullName: loanProviderSigner!.tabs!.fullNameTabs![0].value,
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
        numberTabs?: NumberTab[];
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

type NumberTab = {
    tabLabel: "Loan Establishment Fees"  | "Loan Amount" | "Loan Total Repayment Amount" | "Repayment Instalment Amount" | "Final Repayment Instalment Amount"
    name: string;
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
    tabLabel:  "Customer Date of Birth" | "Customer Phone Number" | "Loan Start Date" | "Loan End Date" | "Repayment Start Date" | "Repayment End Date" | "Customer Address";
    value: string;
}



//TODO: There is only one template currently - when templates get updated this webhook handler must also be updated