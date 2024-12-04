"use server"

import { getExperienceFromDb } from "@/lib/db/repo/dbRepo";
import { notFound } from "next/navigation"


export default async function WaiverPage({params} : {
    params : Promise<{
        experienceId: string
    }>
}) {

    //Get experience from Db
    const experienceDbResult = await getExperienceFromDb((await params).experienceId);

    if(!experienceDbResult.isSuccessful) {
        notFound()
    }

    return (
        <p>
            Anarchy and what nort
        </p>
    )
}
