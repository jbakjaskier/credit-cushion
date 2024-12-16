"use server"

import genAiInstance from "@/lib/ai/gemini"
import { Loan, loanCollectionName } from "@/lib/db/models/loans"
import clientPromise, { dbName } from "@/lib/db/mongodb"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request : NextRequest) {

    const loanCollection = (await clientPromise).db(dbName).collection<Loan>(loanCollectionName)

    const loanHardshipsToBeProcessed = await loanCollection.find(
        {
            'hardship.processingStatus': "toBeProcessed"
        }
    ).toArray()


    if(loanHardshipsToBeProcessed.length === 0) {
        console.info("There are no loan hardships to be processed")
        return NextResponse.json({
            isSuccessful: true
        }, {
            status: 200
        })
    }

    loanHardshipsToBeProcessed.forEach(async (loanHardship) => {
        //Process the loan
        
        
        

    });



    console.info("cron request created", request)


    
    return NextResponse.json({
        detail: "Response"
    }, {
        status: 201
    })


}


