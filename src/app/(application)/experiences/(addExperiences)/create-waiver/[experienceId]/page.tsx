"use server";

//TODO: Must validate experienceId - currently we just assume that it is appropriate

export default async function CreateWaiverPage({
  params,
}: {
  params: Promise<{
    experienceId: string;
  }>;
}) {
  return <h1> {(await params).experienceId} </h1>;
}
